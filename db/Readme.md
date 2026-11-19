# Baza podataka EcoSentryDB

Ova mapa sadrži **dokumentaciju baze podataka**. Same migracije (SQL koji stvara i mijenja bazu) nisu ovdje, nego u backend repozitoriju, jer ih Flyway izvršava pri pokretanju poslužitelja.

| Datoteka | Sadržaj |
| --- | --- |
| [`db_dokumentacija.md`](db_dokumentacija.md) | Opis relacija, atributa i pravila, prijelazi statusa, stanje implementacije |
| [`er-dijagram.md`](er-dijagram.md) | ER dijagram sa svim stupcima (Mermaid, GitHub ga sam iscrta) |
| [`upiti/`](upiti/) | Korisni SQL upiti za čitanje (statistika, provjere). **Nisu migracije** |

Osobna odgovorna za dizajn i održavanje baze podataka: Pavao Maršić

## Ukratko

- **Sustav:** PostgreSQL 18 na usluzi [Neon](https://neon.com) (naravno besplatni plan), projekt `ecosentry`, grana `production`, baza `neondb`.
- **Shemu stvara:** [Flyway](https://flywaydb.org) iz datoteka u [`backend/src/main/resources/db/migration`](../backend/src/main/resources/db/migration), automatski pri svakom pokretanju backenda.
- **Hibernate** shemu samo provjerava (`spring.jpa.hibernate.ddl-auto=validate`). Ako se JPA entitet ne poklapa s tablicom, backend se ne pokrene.
- **Jedna zajednička baza** za cijeli tim i za javnu aplikaciju na Renderu. Pazite da pri testiranju slučajno ne brišete tuđe podatke.

## Migracije

| Migracija | Što radi |
| --- | --- |
| `V1__init.sql` | Stvara svih 9 tablica, ograničenja (`CHECK`, `UNIQUE`, strane ključeve) i indekse |
| `V2__seed.sql` | Početne kategorije otpada i prvi komunalni redar |
| `V3__nalog_kategorije_uloge.sql` | Izbacuje službeni nalog (`nalog_broj`), svodi kategorije na 4 (F-006), dodaje drugog redara i udrugu |
| `V4__test_racuni.sql` | Uloge za zajedničke test račune (`ecosentry.redar@…`, `ecosentry.udruga@…`) |

Flyway u tablici `flyway_schema_history` pamti koje su migracije izvršene i svaku izvrši samo jednom.

## Spajanje na bazu (lokalni razvoj)

1. Kopirajte `backend/.env.example` u `backend/.env`.
2. Upišite `DB_HOST`, `DB_USER` i `DB_PASSWORD` (dobivaju se privatno od zaduženog za bazu, nikad preko GitHuba).
3. `DB_HOST` je adresa **bez** `-pooler` u imenu. Neon u prozoru *Connect* po zadanom nudi adresu s poolingom, koja Flywayu može stvarati probleme.
4. Pokrenite backend. U logu se mora vidjeti `Successfully validated N migrations` i `Started EcosentryApplication`.

Datoteka `backend/.env` je u `.gitignore` i nikad se ne commita.

## Kako promijeniti shemu ili početne podatke

**Pravila:**

- Izvršena migracija (`V1`–`V4`) **nikad se ne mijenja**, ni komentari. Flyway pamti kontrolni zbroj svake datoteke i odbija pokretanje ako se promijeni.
- Svaka promjena je **nova datoteka** sa sljedećim brojem: `V5__kratki_opis.sql`, `V6__…`. Dvije donje crte su obavezne, inače će Flyway datoteke sa recimo samo jednom donjom crtom samo prekočiti, odnsno neće se izvršiti.
- Ako migracija mijenja tablicu koju koristi JPA entitet (npr. briše ili preimenuje stupac), **entitet se mijenja u istom commitu**.

**Postupak:**

1. Nova grana iz najnovijeg `master` (npr. `baza/v5-opis`).
2. Napišite `V5__….sql` u `db/migration`.
3. **Testirajte na Neon grani**, ne na `production`: u Neonu napravite granu iz `production` (s *auto-delete*), privremeno u `.env` stavite njezin host i pokrenite backend.
4. Vratite `DB_HOST` na `production` i ne pokrećite backend dok se PR ne spoji.
5. Commit, push i pull request. Nakon spajanja migracija se na `production` izvrši sama pri prvom pokretanju backenda s novim kodom.

Migracija koja samo dodaje podatke (npr. novi redar), a ne mijenja tablice, može se pokrenuti i izravno na `production`, jer ne ruši kod drugih članova tima.

## Potrošnja (besplatni plan Neona)

- 1 GB prostora i 100 CU-sati računanja mjesečno po projektu.
- Baza se nakon 5 minuta bez prometa sama uspava i tada ne troši CU-sate. Prvi upit nakon buđenja traje malo duže.
- Backend zato ne drži veze otvorenima (`spring.datasource.hikari.minimum-idle=0`, `idle-timeout=60000`). Te postavke nemojte mijenjati bez dogovora.
- Fotografije nisu u bazi (u bazi je samo URL na Cloudinary), pa baza ostaje mala.
- Potrošnja se vidi u Neon konzoli: *Overview* / *Monitoring*.

## Korisni upiti

Mapa [`upiti/`](upiti/) sadrži SQL upite koji **samo čitaju** podatke i ništa ne mijenjaju:

- [`statistika.sql`](upiti/statistika.sql): brojke za statistiku redara (F-020): prijave po mjesecima, postotak riješenih, najkritičniji kvartovi, prijave po kategoriji.
- [`provjere.sql`](upiti/provjere.sql): brza provjera stanja: izvršene migracije, korisnici po ulogama, prijave koje čekaju redara.

Pokreću se ručno u Neon SQL Editoru, a služe i kao predložak za upite u backendu.
