# 2. Analiza zahtjeva

Prioriteti su zadani po MoSCoW metodi: Must (mora biti), Should (trebalo bi biti), Could (može biti ako stignemo) i Won't (ne radimo).

**MVP** čine svi zahtjevi s prioritetom Must: F-001 do F-003, F-005 do F-011, F-014, F-015, F-017, F-018, F-020, F-024, F-025, F-027, F-028, F-030 i F-031. MVP omogućuje osnovni tok aplikacije: građanin prijavi otpad, redar provjeri prijavu, udruga od nje napravi akciju čišćenja, volonteri se prijave na akciju uz upis u kalendar i prognozu, a nakon čišćenja prijava se zatvara.

## 2.1 Funkcijski zahtjevi

### Prijava u sustav i korisnički računi

| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja |
| --- | --- | --- | --- | --- |
| F-001 | Korisnik se prijavljuje u sustav Google računom (OAuth 2.0). | Must | Zadatak | Nakon prijave korisnik ima pristup radnjama svoje uloge. |
| F-002 | Redar može dodati novog redara upisom njegove Google e-mail adrese. | Must | Zadatak | Pri prvoj prijavi s tom adresom korisnik dobiva ulogu redara. Postojećem korisniku uloga se mijenja u redara. |
| F-003 | Eko-udruga može poslati zahtjev za račun udruge, a redar ga odobrava ili odbija. | Must | Zadatak | Dok zahtjev nije odobren, račun nema prava udruge. Nakon odobrenja udruga može kreirati akcije. |
| F-004 | Redar može blokirati korisnika uz upisan razlog. | Should | Zadatak | Blokirani korisnik ne može podnositi prijave ni prijavljivati se na akcije. Redar može ukloniti blokadu. |

### Prijava otpada

| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja |
| --- | --- | --- | --- | --- |
| F-005 | Građanin može podnijeti prijavu otpada s lokacijom, fotografijom i kategorijom (plastika, građevinski, glomazni, ostalo). | Must | Zadatak | Prijava bez lokacije, fotografije ili kategorije se ne sprema i korisnik vidi što nedostaje. Spremljena prijava dobiva ID i status Prijavljeno. |
| F-006 | Lokacija prijave automatski se uzima iz GPS-a, a korisnik je može odabrati i na karti. | Must | Zadatak | Ako korisnik dopusti lokaciju, pribadača se postavi na njegovu poziciju. Ako ne dopusti, lokaciju odabire na karti. |
| F-007 | Fotografija se može dodati kamerom ili iz galerije. | Must | Zadatak | Na mobitelu se nude obje opcije. Slika je vidljiva u detaljima prijave. |
| F-008 | Građanin vidi popis svojih prijava s trenutnim statusom. | Must | Zadatak | Popis sadrži sve prijave korisnika sa statusom kakav je u sustavu. |
| F-009 | Građanin dobiva obavijest u aplikaciji kad se promijeni status njegove prijave. | Must | Zadatak | Obavijest se pojavi pri sljedećem otvaranju aplikacije. |

### Karta

| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja |
| --- | --- | --- | --- | --- |
| F-010 | Prijave se prikazuju na Google karti kao pribadače obojane po statusu (crveno - Prijavljeno, žuto - Akcija u tijeku, zeleno - Očišćeno). | Must | Zadatak | Nova prijava vidljiva je odmah nakon podnošenja, kao crvena. Odbačene prijave i prijave poslane na službenu sanaciju se ne prikazuju. |
| F-011 | Klikom na pribadaču prikazuju se detalji prijave. | Must | Zadatak | Prikazuju se fotografija, kategorija, adresa, status i datum. |
| F-012 | Sustav iz koordinata prijave dohvaća adresu. | Should | Zadatak | Uz prijavu se prikazuje adresa. |
| F-013 | Lokacija prijave može se unijeti upisom adrese. | Should | Zadatak | Upisana adresa postavlja pribadaču na odgovarajuće mjesto na karti. |
| F-014 | Sustav prikazuje mjesto okupljanja akcije i rutu dolaska od trenutne lokacije korisnika. | Must | Zadatak | Volonter vidi mjesto okupljanja i ucrtanu rutu do njega. |

### Komunalni redar

| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja |
| --- | --- | --- | --- | --- |
| F-015 | Redar vidi nove prijave i može ih prihvatiti ili odbaciti. | Must | Zadatak | Odbačena prijava nestaje s karte i prijavitelj dobiva obavijest. |
| F-016 | Redar može promijeniti kategoriju otpada u prijavi. | Should | Zadatak | Nova kategorija vidljiva je svima u detaljima prijave. |
| F-017 | Redar prihvaćenu prijavu šalje eko-udrugama ili na službenu sanaciju. | Must | Zadatak | Udruge vide i u akciju mogu dodati samo prijave poslane njima. Prijava poslana na službenu sanaciju dobiva status Službena sanacija i ne prikazuje se na karti. |
| F-018 | Redar može zatvoriti prijavu uz fotografiju očišćene lokacije. | Must | Zadatak | Status prijave postaje Očišćeno i prijavitelj dobiva obavijest. |
| F-019 | Redar vidi statistiku prijava, poput broja prijava po mjesecima i postotka riješenih. | Should | Zadatak | Brojke odgovaraju podacima u bazi za odabrano razdoblje. |

### Eko-udruga i akcije čišćenja

| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja |
| --- | --- | --- | --- | --- |
| F-020 | Udruga kreira akciju čišćenja odabirom jedne ili više prijava na karti, uz naziv, opis, najveći broj volontera, termin i mjesto okupljanja. | Must | Zadatak | Mogu se odabrati samo prijave poslane udrugama. Akcija se prikazuje u kalendaru udruge, a odabrane prijave dobivaju status Akcija u tijeku. |
| F-021 | Udruga može izmijeniti svoju akciju (naziv, opis, broj volontera, termin). | Should | Zadatak | Izmjene su vidljive volonterima. |
| F-022 | Udruga može otkazati svoju akciju. | Should | Zadatak | Prijave se vraćaju u status Prijavljeno, a prijavljeni volonteri dobivaju obavijest. |
| F-023 | Udruga vidi kalendar svojih akcija s brojem prijavljenih volontera. | Should | Zadatak | Svaka akcija nalazi se na svom datumu i prikazuje popunjenost. |
| F-024 | Nakon akcije udruga učitava fotografiju očišćene lokacije i šalje zahtjev za zatvaranje prijava. | Must | Zadatak | Kad redar potvrdi zahtjev, prijave dobivaju status Očišćeno i prijavitelji dobivaju obavijest. |

### Volontiranje

| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja |
| --- | --- | --- | --- | --- |
| F-025 | Građanin vidi nadolazeće akcije čišćenja s popunjenošću i može se prijaviti kao volonter. | Must | Zadatak | Nakon prijave broj volontera se poveća za jedan. Na popunjenu akciju prijava nije moguća. |
| F-026 | Volonter se može odjaviti s akcije. | Should | Zadatak | Broj volontera se smanji, a događaj se uklanja iz njegovog kalendara. |

### Vanjske integracije

| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja |
| --- | --- | --- | --- | --- |
| F-027 | Kad udruga kreira akciju, sustav kreira događaj u Google kalendaru udruge. | Must | Zadatak | Događaj sadrži termin, poveznicu na lokaciju, kratke upute i podsjetnik 2 sata prije početka. |
| F-028 | Kad se građanin prijavi kao volonter, sustav kreira događaj u njegovom Google kalendaru. | Must | Zadatak | Događaj sadrži termin, poveznicu na lokaciju, kratke upute i podsjetnik 2 sata prije početka. |
| F-029 | Kad se termin akcije promijeni, sustav ažurira događaje u Google kalendarima udruge i volontera. | Should | Zadatak | Događaj u kalendaru pokazuje novi termin. |
| F-030 | Sustav dohvaća vremensku prognozu s OpenWeatherMap za lokaciju i datum akcije i prikazuje je udruzi i volonterima. | Must | Zadatak | Uz akciju se prikazuje prognoza za taj dan. Ako prognoza još nije dostupna, prikazuje se poruka o tome. |
| F-031 | Ako je za termin akcije najavljeno nevrijeme, sustav prikazuje crveno upozorenje i nudi udruzi promjenu termina. | Must | Zadatak | Udruga iz upozorenja može odabrati novi termin, a volonteri dobivaju obavijest o promjeni. |

### Izvan opsega ove verzije

| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja |
| --- | --- | --- | --- | --- |
| F-032 | Sustav šalje obavijesti izvan aplikacije (push ili e-mail). | Won't | Interpretacija zadatka | Obavijesti se prikazuju samo unutar aplikacije. |
| F-033 | Sustav podržava više gradova s odvojenim redarima. | Won't | Interpretacija zadatka | Sustav je za jedan grad. |
| F-034 | Sustav generira službeni nalog i šalje ga komunalnoj tvrtki. | Won't | Interpretacija zadatka | Komunikacija s komunalnom tvrtkom odvija se izvan sustava. |

### Prijava u sustav i korisnički računi

| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja |
| --- | --- | --- | --- | --- |
| F-001 | Korisnik se prijavljuje u sustav Google računom (OAuth 2.0). | Must | Zadatak | Nakon prijave korisnik ima pristup radnjama svoje uloge. |
| F-002 | Redar može dodati novog redara upisom njegove Google e-mail adrese. | Must | Zadatak | Pri prvoj prijavi s tom adresom korisnik dobiva ulogu redara. Postojećem korisniku uloga se mijenja u redara. |
| F-003 | Eko-udruga može poslati zahtjev za račun udruge, a redar ga odobrava ili odbija. | Must | Zadatak | Dok zahtjev nije odobren, račun nema prava udruge. Nakon odobrenja udruga može kreirati akcije. |
| F-004 | Redar može blokirati korisnika uz upisan razlog. | Should | Zadatak | Blokirani korisnik ne može podnositi prijave ni prijavljivati se na akcije. Redar može ukloniti blokadu. |

### Odjava iz sustava

| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja |
| --- | --- | --- | --- | --- |
| F-035 | Korisnik se odjavljuje iz sustava | Must | Zadatak | Odjava odvodi korisnika nazad na početnu stranicu i omogućuje ponovnu prijavu |

## 2.2 Nefunkcijski zahtjevi

| ID | Opis | Prioritet | Izvor | Način provjere |
| --- | --- | --- | --- | --- |
| NF-01 | Sučelje je responzivno. Sve radnje građanina mogu se obaviti na mobitelu širine 360 px bez vodoravnog pomicanja stranice. | Must | Zadatak | Izvršiti radnje građanina na mobitelu i u Chrome DevTools prikazu za mobitel. |
| NF-02 | Radnje redara i udruge dostupne su samo korisnicima s tom ulogom. | Must | Zadatak | Poslati zahtjev za radnju redara kao obični građanin i provjeriti da ga poslužitelj odbija. |
| NF-03 | Aplikacija radi preko HTTPS-a. | Must | Tehničko ograničenje (geolokacija i kamera u pregledniku rade samo preko HTTPS-a) | Provjeriti da se aplikacija otvara preko HTTPS-a. |
| NF-04 | Sustav prihvaća samo slikovne datoteke (JPG, PNG) do 10 MB. | Should | Prijedlog tima | Pokušati učitati PDF i sliku veću od 10 MB i provjeriti da sustav to odbija s porukom. |
| NF-05 | Ako vanjski servis (npr. prognoza) ne odgovara, ostatak aplikacije radi normalno i korisnik vidi poruku da podatak trenutno nije dostupan. | Should | Prijedlog tima | Postaviti neispravan API ključ za prognozu i provjeriti da prijave i akcije i dalje rade. |
| NF-06 | Aplikacija radi u zadnjim verzijama preglednika Chrome, Firefox i Edge te u Safariju na iPhoneu. | Should | Prijedlog tima | Proći kroz glavne radnje u svakom pregledniku. |

## 2.3 Dionici i akteri

| ID uloge ili aktera | Odnos prema sustavu | Relevantni zahtjevi |
| --- | --- | --- |
| A-01 Građanin | Korisnik. Prijavljuje otpad, prati svoje prijave i prijavljuje se na akcije kao volonter. | F-001, F-005 do F-014, F-025, F-026, F-028, F-030 |
| A-02 Eko-udruga | Korisnik. Organizira akcije čišćenja i potvrđuje sanaciju. | F-001, F-003, F-010 do F-014, F-020 do F-024, F-027, F-029 do F-031 |
| A-03 Komunalni redar | Korisnik i administrator. Provjerava prijave, šalje ih udrugama ili na službenu sanaciju, dodaje redare i upravlja korisnicima. | F-002, F-004, F-010, F-011, F-015 do F-019, F-024 |
| A-04 Google (OAuth 2.0) | Vanjski sustav. Pružatelj identiteta koji provodi autentikaciju korisnika. | F-001, F-002 |
| A-05 Google Maps | Vanjski sustav. Prikaz karte, geokodiranje i ruta do mjesta okupljanja. | F-010, F-012, F-013, F-014 |
| A-06 Google Calendar | Vanjski sustav. Upis i ažuriranje događaja za akcije čišćenja. | F-027, F-028, F-029 |
| A-07 OpenWeatherMap | Vanjski sustav. Vremenska prognoza za lokaciju i datum akcije. | F-030, F-031 |
| D-01 Komunalna tvrtka | Dionik. Ne koristi aplikaciju, ali preuzima sanaciju prijava koje redar pošalje na službenu sanaciju. | F-017 |

## 2.4 Ograničenja i pretpostavke

| ID | Tip | Opis ograničenja ili pretpostavke | Izvor | Inženjerska posljedica / Provjera |
| --- | --- | --- | --- | --- |
| C-01 | Ograničenje | Sustav se izrađuje kao web aplikacija, bez zasebne mobilne aplikacije. | Odluka tima | Sučelje za građane mora biti prilagođeno mobitelu. |
| C-02 | Ograničenje | Obavezne su integracije s Google Maps, Google Calendar i OpenWeatherMap API-jem. | Zadatak | Treba nabaviti API ključeve i paziti na ograničenja besplatnih planova. |
| C-03 | Ograničenje | Prijava se mora moći obaviti preko vanjskog servisa (OAuth 2.0). | Zadatak | Svi korisnici, uključujući redare, prijavljuju se Google računom. |
| C-04 | Ograničenje | Za upis događaja u Google kalendar korisnik mora dopustiti pristup kalendaru. | Google Calendar API | Ako korisnik ne dopusti pristup, i dalje koristi aplikaciju, ali mu se akcije ne upisuju u kalendar. |
| AS-01 | Pretpostavka | Novi korisnik dobiva ulogu građanina, udruge šalju zahtjev za račun koji redar odobrava, a nove redare dodaje postojeći redar upisom njihove e-mail adrese. | Interpretacija zadatka | Zadatak spominje račune koje kreira administrator, što pokriva dodavanje redara preko e-mail adrese. |
| AS-02 | Pretpostavka | Sustav pokriva jedan grad. | Interpretacija zadatka | Ako treba više gradova, prijave i redari moraju se vezati uz područje. |
| AS-03 | Pretpostavka | Prognoza je dostupna samo nekoliko dana unaprijed. | Procjena tima | Provjeriti u dokumentaciji OpenWeatherMap. Za akcije dalje u budućnosti prikazuje se poruka da prognoza još nije dostupna. |
| AS-04 | Pretpostavka | Nevrijeme znači najavljenu jaku kišu, oluju, temperaturu iznad 35 °C ili ispod 0 °C. | Procjena tima | Dogovoriti pragove. |
| AS-05 | Pretpostavka | Sustav ne generira službeni nalog. Prijava poslana na službenu sanaciju samo mijenja status, a redar komunalnu tvrtku obavještava izvan sustava. | Odluka tima | Prijava sa statusom Službena sanacija ne prikazuje se na karti i ne može ući u akciju. |

## 2.5 Značajne promjene zahtjeva

| Datum | ID zahtjeva | Promjena i razlog | Dogovoreno s / dokaz |
| --- | --- | --- | --- |
| 15. 11. 2026. | F-017, F-034, AS-05, D-01 | Sustav ne generira službeni nalog. Prijava poslana na službenu sanaciju samo mijenja status i nestaje s karte. | Odluka tima, potvrđeno s asistentom |
| 15. 11. 2026. | F-010, F-017, F-020 | Redar prihvaćenu prijavu šalje udrugama ili na službenu sanaciju, a udruge vide samo prijave poslane njima. | Odluka tima |
| 15. 11. 2026. | F-002, C-03, C-04, AS-01 | Svi korisnici prijavljuju se isključivo Google računom. Novog redara dodaje postojeći redar upisom njegove e-mail adrese. | Odluka tima, potvrđeno s asistentom |
| 15. 11. 2026. | svi | Zahtjevi su prenumerirani nakon uklanjanja i spajanja zahtjeva. | Odluka tima |

## 2.6 Sljedivost zahtjeva

Tablica pokriva zahtjeve realizirane u prvom ciklusu. Oznake CT i ST upućuju na ispitne slučajeve u dokumentu [5. Ispitivanje](5-Ispitivanje.md), gdje se bilježi i ishod svakog slučaja. Zahtjevi koji nisu navedeni u tablici nisu realizirani u prvom ciklusu (popis ispod tablice).

| ID zahtjeva | Obrazac uporabe / modul | Arhitekturna realizacija | Ispitivanje ili provjera |
| --- | --- | --- | --- |
| F-001 | UC-001 | Frontend: `Prijava.jsx`, `App.jsx`, `autentikacijaServis.js`. Backend: `SecurityConfig`, `CustomOidcUserService`, `GET /api/me` | CT-36; ST-01–ST-05 (Google prijava, prvi pristup, prikaz stranice prema ulozi, odjava) |
| F-004 (djelomično) | UC-002 | Backend: provjera blokiranog korisnika pri podnošenju prijave u `PrijavaService`. Blokiranje i uklanjanje blokade (endpointi i sučelje redara) nisu realizirani | CT-05 |
| F-005 | UC-002 | Frontend: `Gradjanin.jsx` (nova prijava), `prijaveServis.js`. Backend: `POST /api/prijave`, `GET /api/kategorije`, `PrijavaService`, `SlikaService` | CT-01–CT-06, CT-23, CT-25, CT-30, CT-34–CT-35; ST-06–ST-07 |
| F-006 | UC-002 | Frontend: `Gradjanin.jsx` (geolokacija preglednika), `KartaPrijava.jsx` (odabir lokacije klikom na kartu) | ST-06 (GPS i/ili odabir lokacije na karti) |
| F-007 | UC-002 | Frontend: polje za odabir slike u `Gradjanin.jsx` (na mobitelu nudi kameru i galeriju) | CT-22–CT-24; ST-06–ST-07 |
| F-008 | UC-009 | Frontend: `Gradjanin.jsx` (Moje prijave). Backend: `GET /api/prijave/moje` | CT-26, CT-32, CT-37; ST-06 |
| F-010 | UC-003 | Frontend: `KartaPrijava.jsx` (Google Maps, boja pribadače po statusu). Backend: `GET /api/prijave` bez odbačenih prijava i prijava na službenoj sanaciji | CT-15–CT-18, CT-29, CT-38; ST-06, ST-08–ST-09 |
| F-011 | UC-003 | Frontend: odabir pribadače u `KartaPrijava.jsx`, detalji prijave u `Gradjanin.jsx` i `KomunalniRedar.jsx` | CT-19–CT-21, CT-31; ST-06 (detalji odabrane pribadače) |
| F-015 | UC-004 | Frontend: `KomunalniRedar.jsx` (Prihvati / Odbaci). Backend: `PATCH /api/prijave/:id`, `PrijavaService` | CT-07–CT-11, CT-27, CT-33; ST-08 |
| F-016 | UC-004 | Frontend: `KomunalniRedar.jsx` (odabir kategorije). Backend: `PATCH /api/prijave/:id`, `GET /api/kategorije` | CT-14; ST-08 |
| F-017 | UC-004, UC-008 | Frontend: `KomunalniRedar.jsx` (Eko-udrugama / Službena sanacija), `EkoUdruga.jsx`. Backend: `PATCH /api/prijave/:id` s `nacinSanacije`, filtriranje u `GET /api/prijave` | CT-12–CT-13, CT-16, CT-21; ST-09 |
| NF-01 | svi | Prilagodba za mobitel u `Gradjanin.css` | ST-10 (prikaz širine 360 px) |
| NF-02 | svi | Backend: `@PreAuthorize` po ulozi u `PrijavaController`, uloga se čita iz tablice korisnika | CT-25–CT-28 (provjera anotacija @PreAuthorize); ST-04, ST-08–ST-09 (ručna provjera uloga) |
| NF-03 | svi | Javno postavljanje na Renderu preko HTTPS-a | ST-11 (HTTPS i javna adresa) |
| NF-04 | UC-002 | Frontend: provjera vrste i veličine slike u `Gradjanin.jsx`. Backend: provjera u `SlikaService`, najveća veličina u `application.properties` | CT-22–CT-24; ST-07 |

**Zahtjevi koji nisu realizirani u prvom ciklusu.** Od zahtjeva prioriteta Must nisu realizirani F-002 (dodavanje redara u aplikaciji; redari su za sada upisani u bazu), F-003 (zahtjev za račun udruge), F-009 (obavijesti), F-014 (mjesto okupljanja i ruta), F-018 (zatvaranje prijave), F-020 (kreiranje akcije), F-024 (zahtjev za zatvaranje), F-025 (prijava volontera na akciju), F-027 i F-028 (Google Calendar), F-030 i F-031 (prognoza i upozorenje na nevrijeme). Stranica eko-udruge u sučelju trenutačno prikazuje probne akcije. Od zahtjeva prioriteta Should realizirani su F-016 i NF-04, F-004 djelomično, a ostali funkcijski zahtjevi (F-012, F-013, F-019, F-021, F-022, F-023, F-026, F-029) nisu. Zahtjevi NF-05 i NF-06 nemaju posebna ispitivanja.

## 2.7 Pregled zahtjeva

| Kontrolna točka | Povratna informacija ili nalaz | Odluka o zahtjevu ili opsegu |
| --- | --- | --- |
| Iteracija 1 | S asistentom je dogovoreno da se svi korisnici prijavljuju samo Google računom, a nove redare dodaje postojeći redar upisom njihove e-mail adrese. Dogovoreno je i da sustav ne mora generirati službeni nalog. | Uklonjeni su zahtjevi za prijavu i promjenu lozinke, a F-002 je promijenjen u dodavanje redara preko e-mail adrese. Službena sanacija samo mijenja status prijave (F-017), a generiranje i slanje naloga je izvan opsega (F-034). |
| Demo 2 |  |  |
| Završni pregled |  |  |
