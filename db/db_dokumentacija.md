# Dokumentacija baze podataka EcoSentryDB

Baza EcoSentryDB pokriva digitalni nadzor i prijavu divljih odlagališta otpada. Povezuje tri skupine korisnika: građane, eko-udruge i komunalne redare. Građani prijavljuju lokacije onečišćenja, komunalni redari provjeravaju prijave i odlučuju čiste li otpad volonteri ili komunalna služba, a eko-udruge za prijave koje su im poslane organiziraju volonterske akcije čišćenja. Cijeli životni ciklus svake prijave, od prijave do čišćenja, bilježi se u bazi radi digitalnog traga i transparentnosti.

Dokument opisuje shemu nakon migracija **V1–V4**. ER dijagram je u [`er-dijagram.md`](../../../../Downloads/er-dijagram.md), a upute za rad s bazom u [`Readme.md`](../../../../Downloads/Readme.md).

## Sadržaj

1. [Tehnički okvir](#1-tehnički-okvir)
2. [Relacije](#2-relacije)
3. [Opis relacija i atributa](#3-opis-relacija-i-atributa)
4. [Opis podataka i pravila](#4-opis-podataka-i-pravila)
5. [Poslovna pravila izvan sheme (backend)](#5-poslovna-pravila-izvan-sheme-backend)
6. [Prijelazi statusa prijave](#6-prijelazi-statusa-prijave)
7. [Tok zatvaranja akcije](#7-tok-zatvaranja-akcije)
8. [Stanje implementacije i poznata odstupanja](#8-stanje-implementacije-i-poznata-odstupanja)
9. [Povijest promjena dizajna](#9-povijest-promjena-dizajna)

---

## 1. Tehnički okvir

| Područje | Rješenje |
| --- | --- |
| Sustav baze | PostgreSQL 18, upravljana usluga Neon (besplatni plan), regija Frankfurt |
| Upravljanje shemom | Flyway migracije u `backend/src/main/resources/db/migration`, izvršavaju se pri pokretanju backenda |
| Veza s aplikacijom | Spring Data JPA (Hibernate), `ddl-auto=validate`: Hibernate shemu samo provjerava i ne smije je mijenjati |
| Prijava korisnika | Isključivo Google (OAuth 2.0 / OpenID Connect). Baza nema lozinki ni korisničkih imena |
| Fotografije | Cloudinary. U bazi je samo `https` URL fotografije |
| Konvencije imena | Tablice i stupci `snake_case`, mala slova |
| Statusi i uloge | ASCII kodovi velikim slovima (`GRADANIN`, `OCISCENO`) koji odgovaraju Java enumima; prikazni nazivi s dijakritikom („Građanin", „Očišćeno") rješava frontend |
| Identifikatori | `BIGINT GENERATED ALWAYS AS IDENTITY` (Java `Long`) |
| Vrijeme | `TIMESTAMPTZ`, sprema se u UTC-u |

### Migracije

| Migracija | Sadržaj |
| --- | --- |
| `V1__init.sql` | Stvara 9 tablica, ograničenja i indekse |
| `V2__seed.sql` | Početne kategorije i prvi komunalni redar |
| `V3__nalog_kategorije_uloge.sql` | Uklanja službeni nalog (`nalog_broj`, `ck_prijava_nalog`), svodi kategorije na 4 prema F-006, dodaje drugog redara i jednu udrugu |
| `V4__test_racuni.sql` | Uloge za zajedničke test račune redara i udruge |

---

## 2. Relacije

| RELACIJA | OPIS | IDENTIFIKATOR |
| --- | --- | --- |
| KORISNIK | Svi korisnici sustava: građani (koji mogu biti i volonteri), eko-udruge i komunalni redari. Lozinke se ne pohranjuju, identitet potvrđuje vanjski pružatelj (Google). Uloga određuje prava, a status računa služi za blokiranje korisnika i odobravanje profila udruga. | **id_korisnik** |
| GOOGLE_TOKEN | Refresh token korisnika za Google Calendar API (šifriran). Potreban da backend može naknadno ažurirati događaje u kalendaru kad korisnik nije prijavljen (F-027, F-030). | **id_korisnik** |
| KATEGORIJA | Šifrarnik vrsta otpada (Plastika, Građevinski otpad, Glomazni otpad, Ostalo). Standardizira unos i olakšava filtriranje i statistiku. | **id_kategorija** |
| PRIJAVA | Evidencija svih prijavljenih divljih odlagališta: GPS koordinate, fotografija, kategorija, procijenjeni volumen, status, je li je redar provjerio i kome ju je poslao na sanaciju. | **id_prijava** |
| AKCIJA | Akcije čišćenja koje organiziraju eko-udruge: naziv, opis, termin, mjesto okupljanja, najveći broj volontera, status, ID događaja u Google kalendaru udruge i fotografija kao dokaz o sanaciji. | **id_akcija** |
| STATUS_LOG | Povijest promjena statusa svake prijave (stari i novi status, tko je promijenio, kada, napomena). Osigurava digitalni trag. | **id_surogat_log** |
| AKCIJA_PRIJAVA | Spojna tablica: akcija obuhvaća jedno ili više odlagališta, a odlagalište može kroz vrijeme biti u više akcija (npr. nakon otkazivanja). | **(id_akcija, id_prijava)** |
| VOLONTER_PRIJAVA | Spojna tablica: sudjelovanje građana kao volontera na akcijama, uz trenutak prijave i ID događaja u kalendaru volontera. | **(id_korisnik, id_akcija)** |
| OBAVIJEST | Obavijesti unutar aplikacije (promjena statusa prijave, otkazana ili izmijenjena akcija, odbijen dokaz o sanaciji), s oznakom pročitano/nepročitano. | **id_obavijest** |

---

## 3. Opis relacija i atributa

Oznake: **PK** primarni ključ, **FK** strani ključ, **UK** jedinstvena vrijednost.

### 3.1 KORISNIK

Središnja tablica sustava. Čuva sve osobe koje koriste aplikaciju: građane (koji mogu biti i volonteri), predstavnike eko-udruga i komunalne redare. Lozinke se ne pohranjuju jer identitet potvrđuje vanjski pružatelj (Google). Zato tablica čuva samo identifikator koji pružatelj vrati, a uloga i status računa određuju što korisnik u aplikaciji smije. Volonter nije posebna uloga, nego građanin koji se prijavio na akciju. Račun udruge je račun **osobe koja predstavlja udrugu**, pa i on ima ime i prezime, a uz to naziv organizacije.

| Atribut | Tip | Ključ / ograničenje | Opis |
| --- | --- | --- | --- |
| `id_korisnik` | BIGINT, identity | PK | Interni identifikator korisnika, na njega pokazuju sve ostale tablice |
| `oauth_provider` | VARCHAR(30) | NOT NULL, zadano `'google'` | Pružatelj identiteta. Zajedno s `id_oauth` čini jedinstven ključ |
| `id_oauth` | VARCHAR(255) | UK s `oauth_provider`, smije biti NULL | Jedinstveni identifikator korisnika kod pružatelja (`sub`). Predviđen za trajno prepoznavanje korisnika (vidi 8.2) |
| `email` | VARCHAR(255) | UK, NOT NULL | E-mail adresa. Po njoj backend pronalazi korisnika pri prijavi i povezuje unaprijed upisane redare i udruge |
| `ime` | VARCHAR(50) | NOT NULL | Ime, za prikaz u aplikaciji |
| `prezime` | VARCHAR(50) | NOT NULL | Prezime, za prikaz u aplikaciji |
| `uloga` | VARCHAR(20) | NOT NULL, CHECK: `GRADANIN`, `UDRUGA`, `REDAR`; zadano `GRADANIN` | Razina prava u aplikaciji. Na njoj se temelji autorizacija radnji |
| `status_racuna` | VARCHAR(20) | NOT NULL, CHECK: `AKTIVAN`, `BLOKIRAN`, `NA_CEKANJU`; zadano `AKTIVAN` | `AKTIVAN` je normalno stanje. `BLOKIRAN` koristi redar za korisnike koji šalju lažne prijave. `NA_CEKANJU` znači da je korisnik zatražio profil udruge, a redar ga još nije odobrio |
| `organizacija_naziv` | VARCHAR(100) | NULL | Naziv eko-udruge. Popunjen **ako i samo ako** je uloga `UDRUGA` (baza to provjerava) |
| `razlog_blokade` | TEXT | NULL | Razlog blokade. Prikazuje se korisniku, a obavezan je kad je status `BLOKIRAN` (baza to provjerava) |
| `datum_registracije` | TIMESTAMPTZ | NOT NULL, zadano `now()` | Kad je korisnik prvi put ušao u sustav |

**Ograničenja:** `uq_korisnik_oauth UNIQUE (oauth_provider, id_oauth)`, `ck_korisnik_udruga`, `ck_korisnik_blokada`.

### 3.2 GOOGLE_TOKEN

Pomoćna tablica za integraciju s Google Calendar API-jem. Čuva dugotrajni token koji omogućuje backendu da mijenja događaje u kalendaru korisnika i kad korisnik nije prijavljen, npr. kad udruga pomakne termin akcije pa treba ažurirati kalendare volontera. Svaki korisnik ima najviše jedan zapis. Tablica je opcionalna: potrebna je samo ako se radi ažuriranje i brisanje događaja (F-027, F-030).

| Atribut | Tip | Ključ / ograničenje | Opis |
| --- | --- | --- | --- |
| `id_korisnik` | BIGINT | PK, FK → `korisnik`, ON DELETE CASCADE | Vlasnik tokena. Kao primarni ključ osigurava najviše jedan token po korisniku |
| `refresh_token_enc` | TEXT | NOT NULL | Sam token, koji se mora spremati **šifriran**, nikad kao čisti tekst |
| `scope` | TEXT | NULL | Dopuštenja koja je korisnik dao (npr. pristup kalendaru) |
| `datum_azuriranja` | TIMESTAMPTZ | NOT NULL, zadano `now()` | Kad je token zadnji put osvježen |

### 3.3 KATEGORIJA

Šifrarnik vrsta otpada. Umjesto da građanin upisuje proizvoljan tekst, bira jednu od ponuđenih kategorija. Time su podaci ujednačeni, a filtriranje na karti i statistika po vrstama otpada postaju jednostavni. Frontend popis kategorija dohvaća iz baze (`GET /api/kategorije`), pa se nova kategorija dodaje novom migracijom, bez izmjene koda.

| Atribut | Tip | Ključ / ograničenje | Opis |
| --- | --- | --- | --- |
| `id_kategorija` | BIGINT, identity | PK | Identifikator na koji pokazuje prijava. Frontend ga šalje pri stvaranju prijave |
| `kategorija_naziv` | VARCHAR(100) | UK, NOT NULL | Naziv koji vidi korisnik. Jedinstven, da se ista kategorija ne unese dvaput |

**Trenutačne kategorije (nakon V3):** Plastika, Građevinski otpad, Glomazni otpad, Ostalo (prema F-006).

### 3.4 PRIJAVA

Osnovni zapis sustava: jedno prijavljeno divlje odlagalište. Kreira je građanin, a prolazi kroz provjeru redara i čišćenje do zatvaranja. Sadrži sve što je potrebno da se lokacija prikaže na karti i da redar donese odluku, a trenutačno stanje prati se kroz status.

| Atribut | Tip | Ključ / ograničenje | Opis |
| --- | --- | --- | --- |
| `id_prijava` | BIGINT, identity | PK | Identifikator prijave |
| `id_korisnik` | BIGINT | FK → `korisnik`, NOT NULL | Građanin koji je podnio prijavu. Služi za popis „Moje prijave" i za obavijesti prijavitelju |
| `id_kategorija` | BIGINT | FK → `kategorija`, NOT NULL | Vrsta otpada, odabrana pri prijavi. Redar je može ispraviti |
| `latituda` | NUMERIC(9,6) | NOT NULL, CHECK −90…90 | Geografska širina (preciznost oko 10 cm) |
| `longituda` | NUMERIC(9,6) | NOT NULL, CHECK −180…180 | Geografska dužina |
| `adresa` | VARCHAR(255) | NULL | Tekstualna adresa iz geokodiranja (F-013). Nije obavezna jer geokodiranje ne mora uspjeti |
| `kvart` | VARCHAR(100) | NULL | Kvart grada, za statistiku „najkritičniji kvartovi" iz zadatka |
| `opis` | TEXT | NULL | Slobodan tekst građanina |
| `url_fotografija` | VARCHAR(500) | NOT NULL | URL fotografije otpada na Cloudinaryju. Obavezna je jer redar po njoj procjenjuje valjanost prijave. Prihvaćaju se JPG i PNG do 10 MB, a slike šire od 1400 px se smanjuju |
| `volumen_estm` | VARCHAR(50) | NULL | Procjena količine otpada, pomaže udruzi da odluči mogu li je očistiti volonteri |
| `status` | VARCHAR(30) | NOT NULL, CHECK (vidi ispod); zadano `PRIJAVLJENO` | Gdje se prijava nalazi u životnom ciklusu |
| `provjerena` | BOOLEAN | NOT NULL, zadano FALSE | Je li redar pregledao prijavu (vidi 4.3) |
| `nacin_sanacije` | VARCHAR(20) | NULL, CHECK: `UDRUGA`, `SLUZBENA` | Odluka redara tko rješava prijavu. NULL dok redar ne odluči |
| `url_foto_sanacija` | VARCHAR(500) | NULL | Fotografija očišćene lokacije kad redar sam zatvara prijavu (F-019) |
| `datum_kreiranja` | TIMESTAMPTZ | NOT NULL, zadano `now()` | Kad je prijava podnesena, za sortiranje i statistiku po mjesecima |

**Statusi (`status`):**

| Kod | Značenje | Boja pribadače |
| --- | --- | --- |
| `PRIJAVLJENO` | Nova ili provjerena prijava koja još nije u akciji | crvena |
| `AKCIJA_U_TIJEKU` | Prijava je uvrštena u akciju čišćenja udruge | žuta |
| `OCISCENO` | Lokacija je očišćena i redar je to potvrdio | zelena |
| `SLUZBENA_SANACIJA` | Redar je prijavu prepustio komunalnoj službi | ne prikazuje se ostalima na karti |
| `ODBACENO` | Lažna prijava, duplikat ili slika bez veze s otpadom | ne prikazuje se na karti, ostaje u bazi radi traga |

**Ograničenje:** `ck_prijava_provjerena`: svaki status osim `PRIJAVLJENO` i `ODBACENO` zahtijeva `provjerena = true`.

### 3.5 AKCIJA

Akcija čišćenja koju organizira eko-udruga. Spaja jedno ili više prijavljenih odlagališta u jedan događaj s terminom i mjestom okupljanja te vodi evidenciju o dokazu da je posao obavljen. Povezana je s Google kalendarom udruge.

| Atribut | Tip | Ključ / ograničenje | Opis |
| --- | --- | --- | --- |
| `id_akcija` | BIGINT, identity | PK | Identifikator akcije |
| `id_udruga` | BIGINT | FK → `korisnik`, NOT NULL | Korisnik s ulogom `UDRUGA` koji organizira akciju |
| `akcija_naziv` | VARCHAR(150) | NOT NULL | Naziv koji volonteri vide na popisu akcija |
| `akcija_opis` | TEXT | NULL | Upute volonterima (što ponijeti, kamo doći). Ulazi i u opis događaja u kalendaru |
| `datum_vrijeme` | TIMESTAMPTZ | NOT NULL | Točan termin. Služi za kalendar i dohvat vremenske prognoze |
| `latituda`, `longituda` | NUMERIC(9,6) | NOT NULL, CHECK raspona | Mjesto okupljanja volontera. Može se razlikovati od lokacija odlagališta |
| `maxbr_volonteri` | INT | NOT NULL, CHECK > 0 | Najveći broj volontera |
| `status_akcija` | VARCHAR(30) | NOT NULL, CHECK: `PLANIRANO`, `ZATVARANJE_ZATRAZENO`, `ZAVRSENO`, `OTKAZANO`; zadano `PLANIRANO` | Stanje akcije |
| `razlog_otkazivanja` | TEXT | NULL | Zašto je akcija otkazana (npr. nevrijeme), za obavijest volonterima |
| `id_google_event` | VARCHAR(255) | NULL | Identifikator događaja u kalendaru **udruge**, da se događaj može ažurirati ili obrisati |
| `url_foto_dokaz` | VARCHAR(500) | NULL | Fotografija očišćenog prostora kao dokaz o sanaciji. Obavezna za `ZATVARANJE_ZATRAZENO` i `ZAVRSENO` (baza to provjerava: `ck_akcija_dokaz`) |

### 3.6 STATUS_LOG

Povijest promjena statusa prijava, odnosno digitalni trag zbog kojeg sustav ostaje transparentan. Svaka promjena statusa jedan je zapis. Iz njega se vidi cijeli put prijave: tko ju je i kada prihvatio, uvrstio u akciju, odbacio ili zatvorio. Građanin ga vidi kao povijest svoje prijave.

| Atribut | Tip | Ključ / ograničenje | Opis |
| --- | --- | --- | --- |
| `id_surogat_log` | BIGINT, identity | PK | Identifikator zapisa (surogatni, jer prirodnog ključa nema) |
| `id_prijava` | BIGINT | FK → `prijava`, NOT NULL | Prijava čiji se status promijenio |
| `id_korisnik_promjena` | BIGINT | FK → `korisnik`, NOT NULL | Tko je napravio promjenu, radi odgovornosti |
| `status_stari` | VARCHAR(30) | NULL | Status prije promjene. Prazan kod prvog zapisa, kad prijava tek nastaje |
| `status_novi` | VARCHAR(30) | NOT NULL | Status nakon promjene |
| `datum_vrijeme` | TIMESTAMPTZ | NOT NULL, zadano `now()` | Točan trenutak promjene |
| `napomena` | TEXT | NULL | Neobavezno obrazloženje, npr. razlog odbacivanja |

### 3.7 AKCIJA_PRIJAVA

Spojna tablica koja rješava vezu više-na-više između akcija i prijava. Jedna akcija može obuhvatiti više odlagališta, a isto odlagalište može kroz vrijeme biti u više akcija, npr. ako je prva akcija otkazana pa ga preuzme druga.

| Atribut | Tip | Ključ / ograničenje | Opis |
| --- | --- | --- | --- |
| `id_akcija` | BIGINT | PK (dio), FK → `akcija` | Akcija koja rješava odlagalište |
| `id_prijava` | BIGINT | PK (dio), FK → `prijava` | Odlagalište koje se akcijom rješava |

Oba atributa zajedno čine primarni ključ, pa se ista prijava ne može dvaput dodati u istu akciju.

### 3.8 VOLONTER_PRIJAVA

Spojna tablica koja bilježi tko sudjeluje na kojoj akciji. Iz nje se broji popunjenost akcije (broj redaka za tu akciju), pa broj volontera ne treba posebno čuvati.

| Atribut | Tip | Ključ / ograničenje | Opis |
| --- | --- | --- | --- |
| `id_korisnik` | BIGINT | PK (dio), FK → `korisnik` | Volonter, odnosno građanin koji se prijavio |
| `id_akcija` | BIGINT | PK (dio), FK → `akcija` | Akcija na koju se prijavio |
| `datum_prijave` | TIMESTAMPTZ | NOT NULL, zadano `now()` | Trenutak prijave, za evidenciju i pregled udruge |
| `id_google_event` | VARCHAR(255) | NULL | Identifikator događaja u kalendaru **tog volontera** |

Primarni ključ `(id_korisnik, id_akcija)` sprječava da se isti volonter dvaput prijavi na istu akciju.

### 3.9 OBAVIJEST

Obavijesti unutar aplikacije (push i e-mail obavijesti nisu u opsegu projekta). Obavijest se kreira kad se nešto promijeni, a korisnik je vidi pri sljedećem otvaranju aplikacije, uz broj nepročitanih.

| Atribut | Tip | Ključ / ograničenje | Opis |
| --- | --- | --- | --- |
| `id_obavijest` | BIGINT, identity | PK | Identifikator obavijesti |
| `id_korisnik` | BIGINT | FK → `korisnik`, NOT NULL | Primatelj |
| `id_prijava` | BIGINT | FK → `prijava`, NULL | Prijava na koju se obavijest odnosi, ako postoji |
| `id_akcija` | BIGINT | FK → `akcija`, NULL | Akcija na koju se obavijest odnosi, ako postoji |
| `tip` | VARCHAR(30) | NOT NULL, CHECK: `STATUS_PRIJAVE`, `PRIJAVA_ODBACENA`, `AKCIJA_IZMIJENJENA`, `AKCIJA_OTKAZANA`, `SANACIJA_ODBIJENA` | Vrsta obavijesti, da je frontend može različito prikazati |
| `poruka` | TEXT | NOT NULL | Tekst koji korisnik vidi, npr. „Vaša prijava #124 je uvrštena u akciju čišćenja" |
| `datum` | TIMESTAMPTZ | NOT NULL, zadano `now()` | Kad je obavijest nastala, za sortiranje |
| `procitana` | BOOLEAN | NOT NULL, zadano FALSE | Je li je korisnik vidio. Po njoj se računa broj novih obavijesti |

### 3.10 Indeksi

PostgreSQL automatski indeksira primarne i jedinstvene ključeve, ali ne i strane ključeve. Zato su dodani indeksi na strane ključeve i stupce po kojima se često filtrira ili sortira:

| Indeks | Tablica (stupci) | Svrha |
| --- | --- | --- |
| `idx_korisnik_uloga` | `korisnik (uloga, status_racuna)` | Popisi redara, udruga na čekanju, blokiranih |
| `idx_prijava_korisnik` | `prijava (id_korisnik)` | „Moje prijave" |
| `idx_prijava_kategorija` | `prijava (id_kategorija)` | Filtriranje i statistika po kategoriji |
| `idx_prijava_status` | `prijava (status)` | Karta (skrivanje odbačenih), popisi po statusu |
| `idx_prijava_datum` | `prijava (datum_kreiranja)` | Sortiranje i statistika po mjesecima |
| `idx_prijava_lokacija` | `prijava (latituda, longituda)` | Pretraga prijava u blizini |
| `idx_akcija_udruga` | `akcija (id_udruga)` | Kalendar akcija jedne udruge |
| `idx_akcija_datum` | `akcija (datum_vrijeme)` | Nadolazeće akcije |
| `idx_statuslog_prijava` | `status_log (id_prijava)` | Povijest jedne prijave |
| `idx_statuslog_korisnik` | `status_log (id_korisnik_promjena)` | Promjene koje je napravio jedan korisnik |
| `idx_akcprij_prijava` | `akcija_prijava (id_prijava)` | U kojoj je akciji prijava |
| `idx_volonter_akcija` | `volonter_prijava (id_akcija)` | Popunjenost akcije |
| `idx_obavijest_korisnik` | `obavijest (id_korisnik, procitana)` | Broj nepročitanih obavijesti |

---

## 4. Opis podataka i pravila

Pravila u nastavku opisuju što baza čuva i kako se podaci smiju mijenjati. Dio pravila baza provodi sama (ograničenja u shemi), a dio provodi backend (poglavlje 5). Pretpostavka cijelog dizajna je da se **svi korisnici prijavljuju isključivo preko Googlea (OAuth 2.0 / OpenID Connect)**, pa baza nema lozinki ni korisničkih imena.

### 4.1 Korisnici i prijava u sustav

- **Jedna uloga po korisniku.** Uloga je `GRADANIN`, `UDRUGA` ili `REDAR`. Volonter nije posebna uloga jer je to građanin koji se prijavio na akciju. Ulogu mijenja samo redar.
- **Prva prijava običnog korisnika.** Ako se Googleom prijavi korisnik kojeg nema u bazi, sustav automatski stvara novi redak s ulogom `GRADANIN` i statusom `AKTIVAN`. Prijava se prihvaća samo ako je Google potvrdio e-mail adresu (`email_verified`).
- **Prepoznavanje korisnika.** Backend korisnika pri svakoj prijavi pronalazi po e-mail adresi, a ulogu čita iz baze, ne od Googlea. Stupac `id_oauth` predviđen je za Googleov stalni identifikator (`sub`), koji se ne mijenja čak ni kad korisnik promijeni e-mail (vidi 8.2).
- **Redari i udruge upisani unaprijed.** Redar se ne može sam registrirati. Prvog redara i ostale članove tima unose migracije (`V2`–`V4`): redak se stvori s ulogom i praznim `id_oauth`, a pri prvoj prijavi tim e-mailom backend ga pronađe i korisnik odmah ima svoju ulogu. Predviđeno je da novog redara kasnije dodaje postojeći redar kroz aplikaciju (F-002).
- **Zahtjev za profil udruge.** Korisnik koji želi organizirati akcije unosi naziv organizacije, a sustav mu postavlja ulogu `UDRUGA`, status `NA_CEKANJU` i upisuje `organizacija_naziv`. Dok je na čekanju, ne smije kreirati akcije, ali ima ista prava kao građanin. Redar zahtjev odobrava (status `AKTIVAN`) ili odbija (uloga se vraća na `GRADANIN`, a naziv organizacije se briše). Baza osigurava da je naziv organizacije popunjen ako i samo ako je uloga `UDRUGA`.
- **Blokiranje.** Redar korisnika blokira promjenom statusa u `BLOKIRAN` uz obavezan razlog (`razlog_blokade`). Blokirani korisnik se i dalje može prijaviti i vidi razlog blokade, ali ne može podnositi prijave ni prijavljivati se na akcije. Pri ukidanju blokade status se vraća na `AKTIVAN`, a razlog se briše. Svi njegovi dosadašnji podaci ostaju u bazi.
- **Korisnici se ne brišu.** Na njih pokazuju prijave, akcije i povijest statusa, pa se račun nikad ne uklanja nego se samo blokira.

### 4.2 Tko što smije

| Radnja | Građanin | Udruga (odobrena) | Redar |
| --- | --- | --- | --- |
| Podnijeti prijavu otpada | da | ne | ne |
| Vidjeti kartu i detalje prijava | da | samo prijave poslane udrugama | da, sve |
| Vidjeti popis svojih prijava | da | ne | ne |
| Prijaviti se na akciju kao volonter | da | da | da |
| Prihvatiti ili odbaciti prijavu, promijeniti kategoriju | ne | ne | da |
| Poslati prijavu udrugama ili na službenu sanaciju | ne | ne | da |
| Kreirati, mijenjati i otkazivati akcije | ne | da (samo svoje) | ne |
| Poslati zahtjev za zatvaranje prijava | ne | da (samo svoje akcije) | ne |
| Potvrditi ili odbiti dokaz o sanaciji, zatvoriti prijavu | ne | ne | da |
| Odobriti profil udruge, blokirati korisnika, dodati redara | ne | ne | da |
| Pregledati statistiku | ne | ne | da |

Pravila ove tablice ne provodi baza, nego backend (Spring Security, `@PreAuthorize`). Trenutačno backend dopušta stvaranje prijave i popis vlastitih prijava samo ulozi `GRADANIN`, a izmjenu prijave samo ulozi `REDAR`.

### 4.3 Prijave

- **Obavezni podaci.** Svaka prijava ima GPS koordinate, fotografiju i točno jednu kategoriju. Opis i procjena volumena nisu obavezni. Adresa i kvart popunjavaju se iz geokodiranja kad je ono dostupno, a ako nije, prijava se svejedno sprema.
- **Fotografija.** Backend sliku prvo provjerava (samo JPG i PNG, najviše 10 MB), zatim je šalje na Cloudinary, a u bazu upisuje dobiveni `https` URL. Slika se šalje tek kad su svi ostali podaci provjereni, da na Cloudinaryju ne ostaju slike odbijenih zahtjeva.
- **Dva odvojena pojma: status i provjera.** `status` kaže gdje je prijava u životnom ciklusu, a zastavica `provjerena` kaže je li je redar pregledao. Odvojeni su jer se nova prijava na karti prikazuje odmah, kao crvena, i prije provjere. Baza osigurava da svaki status osim `PRIJAVLJENO` i `ODBACENO` ima `provjerena = true`. Backend `provjerena = true` postavlja i pri odbacivanju, pa zastavica znači „redar je pregledao prijavu", a ne samo „prihvatio".
- **Provjera redara.** Redar prijavu može prihvatiti, odbaciti (lažna prijava, slika bez veze s otpadom, duplikat) ili joj promijeniti kategoriju ako je građanin pogriješio. Odbačene prijave se **ne brišu**: dobivaju status `ODBACENO` i ne prikazuju se na karti.
- **Odluka o sanaciji.** Prihvaćenu prijavu redar šalje dalje i time upisuje `nacin_sanacije`:
  - **`UDRUGA`**: prijava ostaje u statusu `PRIJAVLJENO`, a eko-udruge je od tada vide i mogu je uvrstiti u akciju čišćenja;
  - **`SLUZBENA`**: status postaje `SLUZBENA_SANACIJA`, prijavu preuzima komunalna služba, a udruge je ne mogu uvrstiti u akciju.

  Odluka je moguća samo za prijavu koja je prihvaćena i još je u statusu `PRIJAVLJENO`.
- **Službena sanacija bez naloga.** Sustav **ne generira** službeni nalog i ne povezuje se s komunalnom tvrtkom (stupac `nalog_broj` uklonjen je u `V3`). Redar samo označava da prijavu rješava komunalna služba.
- **Zatvaranje prijave.** Prijava postaje `OCISCENO` na jedan od dva načina: nakon što redar potvrdi dokaz o sanaciji koji je poslala udruga, ili kad redar sam zatvori prijavu i učita fotografiju (`url_foto_sanacija`, F-019). U oba slučaja prijavitelj dobiva obavijest.
- **Vidljivost.** Odbačene prijave i prijave u službenoj sanaciji ne prikazuju se ostalim korisnicima. Autor uvijek vidi sve svoje prijave, redar vidi sve prijave, a udruga vidi samo prijave poslane udrugama. Tko je podnio prijavu vide samo redar i sam autor.
- **Životni ciklus.** Dopušteni prijelazi statusa navedeni su u poglavlju 6.

### 4.4 Akcije čišćenja

- **Tko organizira.** Akciju kreira samo odobrena udruga (`id_udruga` pokazuje na korisnika s ulogom `UDRUGA` i statusom `AKTIVAN`), i samo ona može mijenjati ili otkazati svoju akciju.
- **Koje prijave.** U akciju se mogu uvrstiti samo prijave koje su provjerene, imaju status `PRIJAVLJENO`, redar ih je poslao udrugama (`nacin_sanacije = UDRUGA`) i nisu već u nekoj aktivnoj akciji. Uvrštene prijave dobivaju status `AKCIJA_U_TIJEKU`. Veza se čuva u `AKCIJA_PRIJAVA`.
- **Termin i mjesto.** Termin ne smije biti u prošlosti. Mjesto okupljanja (koordinate akcije) može se razlikovati od lokacija odlagališta.
- **Izmjena i otkazivanje.** Udruga smije mijenjati ili otkazati akciju samo dok je u statusu `PLANIRANO` i dok joj termin još nije prošao (UC-010, korak 3). Provjera samog statusa nije dovoljna, jer se akcija nakon odbijanja dokaza vraća u `PLANIRANO` s već prošlim terminom.
- **Broj volontera.** Najveći broj (`maxbr_volonteri`) mora biti veći od nule i ne smije se smanjiti ispod broja već prijavljenih volontera.
- **Izmjena termina.** Promjena termina (uključujući odgodu zbog najavljenog nevremena) samo mijenja `datum_vrijeme`, posebnog statusa za odgodu nema. Prijavljeni volonteri dobivaju obavijest, a događaji u Google kalendarima se ažuriraju.
- **Otkazivanje.** Otkazana akcija dobiva status `OTKAZANO` i razlog (`razlog_otkazivanja`). Njezine prijave vraćaju se u `PRIJAVLJENO` i opet su dostupne drugim akcijama. Prijavljeni volonteri dobivaju obavijest. Zato je veza akcija–prijava više-na-više: ista prijava kroz vrijeme može biti u više akcija.
- **Zatvaranje.** Nakon akcije udruga učitava fotografiju očišćenog prostora (`url_foto_dokaz`) i akcija postaje `ZATVARANJE_ZATRAZENO`. Baza ne dopušta taj status ni `ZAVRSENO` bez fotografije. Redar potvrđuje (akcija `ZAVRSENO`, prijave `OCISCENO`) ili odbija (akcija se vraća u `PLANIRANO`, udruga dobiva obavijest i može poslati novu fotografiju). Cijeli tok je u poglavlju 7.

### 4.5 Volonteri

- **Jedna prijava po akciji.** Isti se korisnik ne može dvaput prijaviti na istu akciju (primarni ključ `(id_korisnik, id_akcija)`).
- **Popunjenost.** Broj volontera se **ne sprema** kao stupac, nego se računa brojanjem redaka u `VOLONTER_PRIJAVA`, pa se ne može razići sa stvarnim stanjem. Na popunjenu akciju prijava nije moguća, a backend to provjerava uz zaključavanje akcije, kako dvije istovremene prijave ne bi probile limit.
- **Odjava.** Odjava briše redak volontera, čime se oslobađa mjesto, i uklanja njegov događaj iz kalendara.
- **Tko smije.** Prijaviti se mogu svi neblokirani korisnici.

### 4.6 Google kalendar

- Pri kreiranju akcije sustav stvara događaj u kalendaru udruge i sprema njegov ID u `akcija.id_google_event`. Pri prijavi volontera stvara događaj u njegovu kalendaru i sprema ID u `volonter_prijava.id_google_event`. Taj ID treba da se događaj kasnije može ažurirati ili obrisati.
- Pristup kalendaru korisnik mora odobriti. Ako ga ne odobri, prijava na akciju (ili akcija) se svejedno sprema, samo je `id_google_event` prazan, a sustav prikaže poruku da događaj nije upisan u kalendar.
- Ako se želi ažurirati kalendar volontera dok on nije prijavljen (npr. promjena termina), backend mora imati njegov refresh token. Zato postoji opcionalna tablica `GOOGLE_TOKEN`, koja se mora čuvati šifrirana.

### 4.7 Povijest statusa i obavijesti

- **Digitalni trag.** Svaka promjena statusa prijave upisuje se u `STATUS_LOG`: stari i novi status, korisnik koji je promijenio, vrijeme i neobavezna napomena. Prvi zapis (kreiranje prijave) nema stari status, pa je `status_stari` prazan. Zapis se upisuje u istoj transakciji kao i promjena statusa, a obavlja ga backend jer baza ne zna tko je korisnik.
- **Obavijesti** postoje samo unutar aplikacije (push i e-mail nisu u opsegu). Korisnik ih vidi pri sljedećem otvaranju aplikacije, uz broj nepročitanih.

| Događaj | Primatelj obavijesti | Tip |
| --- | --- | --- |
| Promjena statusa prijave (prihvaćena, u akciji, očišćena, službena sanacija) | Podnositelj prijave | `STATUS_PRIJAVE` |
| Prijava odbačena | Podnositelj prijave | `PRIJAVA_ODBACENA` |
| Izmjena ili odgoda akcije | Prijavljeni volonteri | `AKCIJA_IZMIJENJENA` |
| Akcija otkazana | Prijavljeni volonteri | `AKCIJA_OTKAZANA` |
| Redar odbio dokaz o sanaciji | Udruga | `SANACIJA_ODBIJENA` |

### 4.8 Vremenska prognoza

Prognoza (OpenWeatherMap) **ne sprema se u bazu**, nego se dohvaća uživo na temelju koordinata i termina akcije (F-031). Ako je ne može dohvatiti, jer je akcija predaleko u budućnosti ili servis ne odgovara, sustav prikazuje poruku i sve ostalo radi normalno (NF-06). Prema pretpostavci tima (AS-04), nevrijeme znači jaku kišu, oluju, temperaturu iznad 35 °C ili ispod 0 °C. Tada se organizatoru prikazuje upozorenje i nudi promjena termina.

### 4.9 Sažetak: tko čuva koje pravilo

- **Baza:** jedinstvenost (e-mail, identitet, naziv kategorije), dopuštene vrijednosti statusa, uloga i načina sanacije, raspon koordinata, najveći broj volontera veći od nule, obavezne fotografije i odnosi među stupcima (naziv udruge, razlog blokade, provjera prije napredovanja statusa, dokaz o sanaciji).
- **Backend:** tko smije koju radnju, vidljivost prijava, limit volontera, upis povijesti statusa, provjera da je organizator odobrena udruga i da je prijava u akciji poslana udrugama. Popis je u poglavlju 5.
- **Ništa se ne briše.** Prijave, akcije i korisnici mijenjaju samo status, jer je smisao sustava da svaka prijava ima trag od podnošenja do čišćenja.

---

## 5. Poslovna pravila izvan sheme (backend)

Ova pravila baza ne može provesti sama, pa ih provodi backend (Spring Boot), u transakciji gdje je naznačeno. Stupac **Stanje** kaže je li pravilo već u kodu.

| Pravilo | Provedba | Stanje |
| --- | --- | --- |
| Autorizacija po ulozi (NF-02) | Spring Security; uloga se pri prijavi čita iz baze i dodaje kao `ROLE_GRADANIN` / `ROLE_UDRUGA` / `ROLE_REDAR`; `@PreAuthorize` na metodama kontrolera | provedeno |
| Prijava samo s potvrđenim e-mailom | `CustomOidcUserService` odbija Google račun bez `email_verified` | provedeno |
| Blokirani korisnik ne može podnijeti prijavu | Provjera u `PrijavaService.stvori` | provedeno |
| Kategorija mora postojati | Provjera ID-a kategorije u `PrijavaService`, inače odgovor 400 | provedeno |
| Vidljivost prijava (4.3) | `PrijavaService`: filtriranje po ulozi, statusu i `nacin_sanacije` | provedeno |
| Odluka o sanaciji samo za prihvaćenu prijavu u statusu `PRIJAVLJENO` | Provjera u `PrijavaService.izmijeni` | provedeno |
| Odbačenoj prijavi ne mijenja se kategorija | Provjera u `PrijavaService.izmijeni` | provedeno |
| Ne brisati prijave, akcije ni korisnike | Nema ruta za brisanje; samo promjena statusa | provedeno |
| Uloga `UDRUGA` vrijedi samo uz status `AKTIVAN` (F-004) | Provjera statusa računa pri dodjeli prava | planirano |
| Upis u `status_log` | Servis upisuje zapis u istoj transakciji kao promjenu statusa | planirano |
| Najveći broj volontera | U transakciji zaključati redak akcije (`PESSIMISTIC_WRITE`), usporediti `COUNT(*)` iz `volonter_prijava` s `maxbr_volonteri`, pa upisati | planirano |
| Izmjena i otkazivanje samo akcije u statusu `PLANIRANO` s terminom u budućnosti | Provjera u servisu (UC-010, korak 3) | planirano |
| Najveći broj volontera ne smije se smanjiti ispod broja prijavljenih | Provjera u servisu (UC-010, 3c) | planirano |
| `akcija.id_udruga` mora biti korisnik s ulogom `UDRUGA` i statusom `AKTIVAN` | Provjera u servisu | planirano |
| U akciju samo prijave sa statusom `PRIJAVLJENO`, `provjerena = true`, `nacin_sanacije = UDRUGA`, koje nisu već u aktivnoj akciji | Provjera u servisu (UC-005, 1a) | planirano |
| Termin akcije ne smije biti u prošlosti | Provjera u servisu (UC-005, 2a) | planirano |

---

## 6. Prijelazi statusa prijave

| Radnja | Status | Provjerena | Način sanacije | Tko |
| --- | --- | --- | --- | --- |
| Građanin podnese prijavu | **PRIJAVLJENO** | false | NULL | Građanin |
| Redar prihvati | **PRIJAVLJENO** | true | NULL | Redar |
| Redar odbaci | **ODBACENO** | true | NULL | Redar |
| Redar pošalje udrugama | **PRIJAVLJENO** | true | **UDRUGA** | Redar |
| Redar pošalje na službenu sanaciju | **SLUZBENA_SANACIJA** | true | **SLUZBENA** | Redar |
| Udruga kreira akciju | **AKCIJA_U_TIJEKU** | true | UDRUGA | Udruga |
| Akcija otkazana | **PRIJAVLJENO** | true | UDRUGA | Udruga |
| Redar potvrdi dokaz udruge | **OCISCENO** | true | UDRUGA | Redar |
| Redar sam zatvori prijavu (F-019) | **OCISCENO** | true | nepromijenjen | Redar |

Ostale prijelaze (npr. iz `OCISCENO` natrag) backend ne dopušta. Baza ne dopušta `OCISCENO`, `AKCIJA_U_TIJEKU` ni `SLUZBENA_SANACIJA` uz `provjerena = false`, pa redar koji zatvara neprovjerenu prijavu mora je prvo prihvatiti.

---

## 7. Tok zatvaranja akcije

Opisuje što se događa nakon što je akcija održana: udruga mora dokazati da je lokacija očišćena, a redar to potvrđuje. Tek tada prijave postaju `OCISCENO`.

**Preduvjeti za zahtjev udruge**

- Zahtjev smije poslati samo udruga koja je organizirala tu akciju.
- Akcija mora biti u statusu `PLANIRANO`, a njezin termin (`datum_vrijeme`) mora već biti prošao. Za akciju koja se još nije održala zahtjev nije dopušten.
- Obavezna je fotografija očišćenog prostora (JPG ili PNG do 10 MB, NF-05).

**Koraci**

1. Udruga učita fotografiju: `akcija.url_foto_dokaz` se popuni, a `status_akcija` postaje `ZATVARANJE_ZATRAZENO`. Redar vidi zahtjev na svom popisu.
2. Redar **potvrdi**. U jednoj transakciji se za **svaku** prijavu te akcije događa sljedeće:
   - ako je prijava još u statusu `AKCIJA_U_TIJEKU`, status postaje `OCISCENO`;
   - u `status_log` upisuje se zapis (stari i novi status, redar kao autor);
   - prijavitelju se stvara obavijest tipa `STATUS_PRIJAVE`.

   Zatim akcija postaje `ZAVRSENO`. Prijave koje u međuvremenu više nisu `AKCIJA_U_TIJEKU` (npr. redar ju je sam zatvorio uz vlastitu fotografiju) preskaču se i ostaju kakve jesu.
3. Redar **odbije**: akcija se vraća u `PLANIRANO`, a udruga dobiva obavijest `SANACIJA_ODBIJENA` i može učitati novu fotografiju. Stara fotografija se zamjenjuje novom. Prijave ostaju `AKCIJA_U_TIJEKU`.

**Dodatno**

- Dok je akcija u statusu `ZATVARANJE_ZATRAZENO`, udruga je ne može otkazati ni izmijeniti, nego mora čekati odluku redara.
- Potvrda vrijedi za **cijelu akciju odjednom**. Ako akcija obuhvaća više odlagališta, a fotografija je jedna, redar ne može potvrditi samo neka od njih.
- Redar može prijavu zatvoriti i bez akcije, uz vlastitu fotografiju (`prijava.url_foto_sanacija`). To je zaseban tok (F-019) i ne prolazi kroz zahtjev udruge.

---

## 8. Stanje implementacije i poznata odstupanja

### 8.1 Što aplikacija trenutačno koristi

Shema je napravljena za cijeli odobreni opseg, a backend zasad koristi samo tablice **`korisnik`**, **`kategorija`** i **`prijava`** (JPA entiteti `Korisnik`, `Kategorija`, `Prijava`). Tablice `akcija`, `akcija_prijava`, `volonter_prijava`, `obavijest`, `status_log` i `google_token` postoje u bazi, ali još nemaju entitete ni kod koji ih koristi. Status `AKCIJA_U_TIJEKU` zato se još ne postavlja.

### 8.2 Poznata odstupanja između dizajna i koda

| Odstupanje | Posljedica                                                                                                         | Prijedlog |
| --- |--------------------------------------------------------------------------------------------------------------------| --- |
| Backend korisnika prepoznaje samo po e-mailu, a `id_oauth` (Googleov `sub`) se ne popunjava. | Ako korisnik promijeni e-mail na Google računu, sustav ga pri sljedećoj prijavi ne prepoznaje i stvara novi račun. | Pri prijavi upisati `sub` u `id_oauth` i korisnika tražiti prvo po njemu, a tek onda po e-mailu. |
| Pri svakoj prijavi backend u `ime` upisuje puno ime s Google računa, a `prezime` novih korisnika ostaje prazno. | Kod unaprijed upisanih korisnika ime i prezime se ponavljaju (npr. ime „Jozo Bubalo", prezime „Bubalo").           | Iz Googlea čitati zasebno ime (`given_name`) i prezime (`family_name`). |
| Uloga `UDRUGA` dodjeljuje se bez obzira na status računa. | Udruga sa statusom `NA_CEKANJU` dobiva prava udruge prije odobrenja.                                               | Pravo `ROLE_UDRUGA` davati samo uz `status_racuna = AKTIVAN`. |
| `status_log` se još ne popunjava. | Za postojeće prijave nema traga tko je i kada promijenio status.                                                   | Upis dodati zajedno s ostalim promjenama statusa. |
| Primarni ključ `akcija_prijava` je par (akcija, prijava). | Kad se akcije implementiraju, baza sama ne sprječava da ista prijava bude u dvije aktivne akcije.                  | Provjeravati u servisu i razmotriti djelomični jedinstveni indeks u novoj migraciji. |

### 8.3 Otvorena pitanja

| Pitanje | Opcije | Prijedlog                                                                        |
| --- | --- |----------------------------------------------------------------------------------|
| Što je „riješena" prijava u statistici (F-020) | samo `OCISCENO`, ili i `SLUZBENA_SANACIJA` | Brojati oba; upiti u [`upiti/statistika.sql`](upiti/statistika.sql) će tako raditi |
| Više fotografija po prijavi | jedna (sada) ili zasebna tablica fotografija | Jedna za opseg projekta                                                          |
| Pretraga prijava „u blizini" | raspon koordinata (indeks već postoji) ili PostGIS | Raspon koordinata                                                                |
| `google_token` | zadržati ili izostaviti | Zadržati ako se rade F-027 i F-030                                               |

---

## 9. Povijest promjena dizajna

Prvi dizajn je dokument *Opis baze podataka EcoSentryDB* (lokalni dokument kod dizajnera baze, također privatno podijeljen sa timom, prvotno MySQL predložak). Promjene su nastale prelaskom na PostgreSQL i usklađivanjem s kodom i zahtjevima.

| Područje | Prvi dizajn                                                           | Sada                                                                                      | Razlog |
| --- |-----------------------------------------------------------------------|-------------------------------------------------------------------------------------------| --- |
| Sustav | MySQL (primjerice `AUTO_INCREMENT`)                                   | PostgreSQL 18 na Neonu, `GENERATED ALWAYS AS IDENTITY`                                    | Odluka tima (ADR-02) |
| Identifikatori | `INT`                                                                 | `BIGINT`(neke Java klase su već postojale prije konačnog dizajna baze, prilagodba)        | Java kod koristi `Long` |
| Vrijeme | `TIMESTAMP`                                                           | `TIMESTAMPTZ`                                                                             | Jednoznačno vrijeme u UTC-u |
| Imena | `ID_Korisnik`, `Latituda`                                             | `id_korisnik`, `latituda` (`snake_case`)                                                  | Konvencija PostgreSQL-a |
| Vrijednosti statusa i uloga | Tekst s dijakritikom (`'Očišćeno'`)                                   | ASCII kodovi (`OCISCENO`, `GRADANIN`)                                                     | Poklapanje s Java enumima |
| Korisnik | lozinka i korisničko ime za redare                                    | samo Google prijava; `oauth_provider`, `id_oauth`, `razlog_blokade`, `datum_registracije` | Odluka tima: prijava samo preko Googlea |
| Prijava | statusi bez odbacivanja; nije se moglo zapisati je li redar provjerio | + `ODBACENO`, `provjerena`, `nacin_sanacije`, `url_foto_sanacija`, `kvart`                | F-016, F-019, statistika po kvartovima, slanje udrugama |
| Službeni nalog | `nalog_broj` (dodan u V1)                                             | uklonjen u V3                                                                             | Odluka tima: sustav ne generira nalog |
| Kategorije | primjeri u tekstu                                                     | V2: 10 kategorija, V3: 4 prema F-006                                                      | Usklađivanje sa zahtjevima |
| Akcija | Planirano, Završeno, Otkazano zbog vremena                            | `PLANIRANO`, `ZATVARANJE_ZATRAZENO`, `ZAVRSENO`, `OTKAZANO`                               | F-025, UC-007, UC-010 |
| Nove tablice | —                                                                     | `OBAVIJEST`, `GOOGLE_TOKEN`                                                               | F-010, F-027, F-030 |
| Ograničenja | samo PK, FK, UNIQUE                                                   | + `CHECK` na statuse, koordinate, broj volontera i međuovisnosti stupaca                  | Baza sama čuva ispravnost podataka |
| Upravljanje shemom | jedna skripta                                                         | Flyway migracije V1–V4                                                                    | Ista shema za cijeli tim i Render |
