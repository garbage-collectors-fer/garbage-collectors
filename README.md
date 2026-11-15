# EcoSentry

EcoSentry omogućuje građanima da prijave divlja odlagališta otpada na karti, a komunalnim redarima i eko-udrugama da ih provjere i organiziraju čišćenje.

**Projekt na kolegiju:** Ovu je aplikaciju razvio studentski tim u sklopu kolegija [Programsko inženjerstvo](https://www.fer.unizg.hr/predmet/proinz) na Fakultetu elektrotehnike i računarstva Sveučilišta u Zagrebu (FER).

## Opis aplikacije

Građanin koji naiđe na odbačeni otpad često ne zna kome ga prijaviti ni što se s prijavom dogodilo. EcoSentry na jednom mjestu povezuje građane, komunalne redare i eko-udruge. Građanin prijavi otpad sa slikom i lokacijom, redar provjeri prijavu i odluči čiste li je volonteri ili komunalna tvrtka, a eko-udruge za prijave koje su im poslane organiziraju akcije čišćenja.

**Ključne funkcionalnosti**

Trenutačno radi:

- Prijava Google računom. Novi korisnik dobiva ulogu građanina, a uloga se čita iz baze.
- Građanin: prijava otpada s fotografijom, kategorijom i lokacijom (GPS ili klik na kartu), karta prijava i popis vlastitih prijava.
- Komunalni redar: popis i karta prijava, prihvaćanje ili odbacivanje prijave, promjena kategorije i slanje prijave eko-udrugama ili na službenu sanaciju.
- Eko-udruga: pregled prijava koje je redar poslao udrugama.

U izradi:

- Akcije čišćenja i prijava volontera, s Google kalendarom i vremenskom prognozom.
- Obavijesti unutar aplikacije, zatvaranje prijava, dodavanje redara i statistika.

Za potpuni opseg, zahtjeve, oblikovanje i dokaze ispitivanja pogledajte [docs](docs/Home.md).

<a id="deployment"></a>
## Postavljanje (engl. deployment)

**Javno dostupna aplikacija:** https://ecosentry-6rg1.onrender.com

**Isprobajte:** Prijavite se Google računom, kliknite **+ Prijavi otpad**, odaberite lokaciju na karti, kategoriju i fotografiju te pošaljite prijavu. Nova prijava pojavljuje se pod **Moje prijave** i kao crvena pribadača na karti.

**Demonstracija:** Prijava je Google računom. Svaki novi korisnik dobiva ulogu građanina. Uloge komunalnog redara i eko-udruge dodjeljuje tim, pa za njihovo isprobavanje treba se javiti timu.

**Ograničenja:**

- Prvo otvaranje može trajati do dvije minute jer se besplatna Render instanca nakon neaktivnosti gasi.
- Fotografije prijava spremaju se na disk Render poslužitelja, pa nestaju pri svakom novom postavljanju i ponovnom pokretanju. Prijave ostaju u bazi, ali bez slike.
- Adresa se još ne dohvaća iz koordinata, pa se uz prijavu prikazuju koordinate.
- Nakon svakog novog postavljanja korisnici se moraju ponovno prijaviti.

[Vodič za postavljanje i pokretanje](docs/6-Postavljanje-instalacija-i-konfiguracija.md) opisuje smještaj aplikacije koji tim koristi.

<a id="quick-start"></a>
## Brzi početak / instalacija

**Preduvjeti:** Git, Node.js 22 (s npm-om) za frontend i Java 21 za backend. Maven nije potrebno instalirati jer projekt ima Maven Wrapper (`mvnw`).

```bash
git clone https://github.com/garbage-collectors-fer/garbage-collectors.git
cd garbage-collectors

# backend (u jednom terminalu)
cd backend
./mvnw spring-boot:run        # na Windowsu: mvnw spring-boot:run

# frontend (u drugom terminalu)
cd frontend
npm install
npm run dev
```

**Adresa:** frontend radi na http://localhost:5173, a backend na http://localhost:8080.

**Konfiguracija:**

- `backend/.env`: kopirajte `backend/.env.example` i upišite `GOOGLE_CLIENT_ID` i `GOOGLE_CLIENT_SECRET` za Google prijavu te `DB_HOST`, `DB_USER` i `DB_PASSWORD` za spajanje na bazu.
- `frontend/.env`: kopirajte `frontend/.env.example` i upišite `VITE_GOOGLE_MAPS_API_KEY` za kartu. `VITE_API_URL` ostaje `http://localhost:8080`.

Ključeve za Google dobijete od člana tima zaduženog za Google Cloud projekt, a podatke za bazu od člana zaduženog za bazu. Datoteke `.env` se ne commitaju.

Backend se i lokalno spaja na PostgreSQL bazu na Neonu, a tablice i početne podatke pri pokretanju stvara Flyway. Za provjeru otvorite http://localhost:5173 i prijavite se Google računom: trebala bi se otvoriti stranica građanina s kartom i gumbom **+ Prijavi otpad**. Za detaljno postavljanje pogledajte [projektnu dokumentaciju](docs/Home.md).

## Tehnologije

| Tehnologija ili alat | Uloga u ovom projektu | Razlog uporabe ili važno ograničenje |
| --- | --- | --- |
| React + Vite | Korisničko sučelje za građanina, eko-udrugu i redara. | Popis, karta i detalji prijave osvježavaju se bez ponovnog učitavanja stranice. Sučelje građanina prilagođeno je mobitelu. |
| Spring Boot (Java 21) | Backend: prijava korisnika, provjera uloga i REST API na `/api/...`. | Uloge se provjeravaju na poslužitelju, a ne samo u sučelju. Rute su opisane u [docs/api.md](docs/api.md). |
| PostgreSQL (Neon) + Spring Data JPA + Flyway | Spremanje korisnika, prijava i kategorija. | Baza je u oblaku pa je zajednička za cijeli tim i za Render. Shemu stvaraju Flyway migracije, a Hibernate je samo provjerava. Besplatna Neon baza se uspava kad nema prometa, pa prvi upit može potrajati. |
| Google prijava (OAuth 2.0 / OpenID Connect) | Prijava korisnika Google računom. | Obavezno prema zadatku. Svi korisnici, uključujući redare, prijavljuju se Google računom, pa sustav ne sprema lozinke. |
| Google Maps JavaScript API | Karta s pribadačama prijava u bojama prema statusu i odabir lokacije nove prijave. | Treba API ključ ograničen na adrese aplikacije. Bez ključa stranica radi, ali se karta ne prikazuje. |
| Docker + Render | Frontend i backend grade se u jednu aplikaciju i postavljaju na javnu adresu. | Frontend i backend su na istoj adresi, pa kolačić prijave radi bez dodatne konfiguracije. Promjena na `master` automatski se postavlja. |

<a id="team-members"></a>
## Članovi tima

| Član | Glavna uloga ili doprinos |
| --- | --- |
| Nikola Mihanović | Backend: Spring Boot, Google prijava, postavljanje na Render |
| Tibor Andreani | Backend: entiteti, baza podataka i REST API za prijave |
| Ivana Markovinović | Frontend: stranice komunalnog redara i građanina, prijava u aplikaciju, komponenta karte; dokumentacija (zahtjevi, obrasci uporabe, API, README) |
| Leo Žigman | Frontend: kostur aplikacije i stranica eko-udruge |
| Aki Pandžić | Frontend: prva inačica stranice građanina i prijave |
| Bruno Hrgovan | Ispitivanje sustava; dokumentacija (ispitivanje, postavljanje i konfiguracija) |
| Pavao Maršić | Backend: izrada i postavljanje baze podataka, spremanje slika prijava; dokumentacija (arhitektura i oblikovanje) |

Uloge se tijekom projekta mogu mijenjati. Repozitorij i dogovoreni alat za praćenje zadataka služe kao dodatni dokazi timskog rada.

## Doprinos projektu

Svaki član radi na svojoj grani, a promjene ulaze u `master` preko pull requesta. Promjena na `master` automatski se postavlja na Render.

<a id="license"></a>

**Status licence:** Tim još nije odabrao licencu aplikacije. Datoteka `LICENSE` u repozitoriju sadrži licencu predloška dokumentacije, a ne licencu aplikacije.

Dokumentacijski predložak kolegija sadrži otvorene obrazovne sadržaje (engl. Open Educational Resources, OER) i licenciran je licencom Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International. Ta licenca **ne određuje automatski licencu studentske aplikacije**.

Kod trećih strana, skupovi podataka, slike, ikone i drugi sadržaji zadržavaju vlastite licence i uvjete uporabe.

<a id="ai-usage"></a>
## Uporaba umjetne inteligencije [![AI Usage: Disclosed](https://img.shields.io/badge/AI%20Usage-Disclosed-blue.svg)](https://www.fer.unizg.hr/_download/repository/Policy%20on%20the%20appropriate%20use%20of%20artificial%20intelligence%20at%20the%20faculty%20of%20electrical%20engineering%20and%20computing%5B1%5D.pdf)

Ovaj projekt slijedi FER-ova [pravila o primjerenoj uporabi umjetne inteligencije](https://www.fer.unizg.hr/_download/repository/Policy%20on%20the%20appropriate%20use%20of%20artificial%20intelligence%20at%20the%20faculty%20of%20electrical%20engineering%20and%20computing%5B1%5D.pdf).

**Izjava:** Tim je koristio alate umjetne inteligencije uz dopuštenje asistenta. Claude korišten je za pomoć pri organizaciji i strukturiranju projekta, prijedlog API-ja i provjeru dokumentacije. Svaki član pregledao je i isprobao kod i tekst koji je predao te može objasniti svoj doprinos. U alate nisu unošeni pristupni podaci.

<a id="code-of-conduct-and-support"></a>
## Kodeks ponašanja i podrška [![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](CODE_OF_CONDUCT.md)

Od članova tima očekuje se pridržavanje **Kodeksa ponašanja studenata** Fakulteta elektrotehnike i računarstva Sveučilišta u Zagrebu, pravila timskog rada na kolegiju i [Etičkog kodeksa IEEE-a](https://www.ieee.org/about/corporate/governance/p7-8.html). Pogledajte i [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md).

---

Struktura dokumentacije prilagođena je predlošku kolegija Programsko inženjerstvo FER-a autora [Vlade Sruka](https://www.fer.unizg.hr/vlado.sruk), licenciranom pod [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/). Aplikaciju i njezin sadržaj izradio je gore navedeni studentski tim.
