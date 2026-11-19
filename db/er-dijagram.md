# ER dijagram baze EcoSentryDB

Dijagram prikazuje shemu baze **nakon migracija V1–V4**, sa svim stupcima. GitHub ga iscrta izravno iz ove datoteke. Za izvoz u sliku kod se može zalijepiti na [mermaid.live](https://mermaid.live).

Sažeta verzija (samo ključni atributi) nalazi se u arhitekturi: [4.3.1 ER dijagram i model podataka](../docs/4-Arhitektura-i-oblikovanje.md), izvor [`4-2-ecosentry-data-ERD.puml`](../docs/puml/4-2-ecosentry-data-ERD.puml). Kad nova migracija promijeni tablice ili veze, treba ažurirati oba dijagrama.

**Oznake:** `PK` primarni ključ, `FK` strani ključ, `UK` jedinstvena vrijednost. Komentar uz stupac navodi dopuštene vrijednosti (`CHECK`) ili napomenu. Stupci bez `NOT NULL` u komentaru označeni su s „može biti NULL".

```mermaid
erDiagram
    KORISNIK {
        bigint id_korisnik PK
        varchar oauth_provider "zadano google"
        varchar id_oauth "Google sub, može biti NULL; UK zajedno s oauth_provider"
        varchar email UK
        varchar ime
        varchar prezime
        varchar uloga "GRADANIN | UDRUGA | REDAR"
        varchar status_racuna "AKTIVAN | BLOKIRAN | NA_CEKANJU"
        varchar organizacija_naziv "obavezno ako i samo ako je uloga UDRUGA"
        text razlog_blokade "obavezno kad je BLOKIRAN"
        timestamptz datum_registracije
    }

    GOOGLE_TOKEN {
        bigint id_korisnik PK, FK
        text refresh_token_enc "šifrirano"
        text scope "može biti NULL"
        timestamptz datum_azuriranja
    }

    KATEGORIJA {
        bigint id_kategorija PK
        varchar kategorija_naziv UK
    }

    PRIJAVA {
        bigint id_prijava PK
        bigint id_korisnik FK "prijavitelj"
        bigint id_kategorija FK
        numeric latituda "9,6; od -90 do 90"
        numeric longituda "9,6; od -180 do 180"
        varchar adresa "može biti NULL"
        varchar kvart "može biti NULL"
        text opis "može biti NULL"
        varchar url_fotografija "Cloudinary URL"
        varchar volumen_estm "može biti NULL"
        varchar status "PRIJAVLJENO | AKCIJA_U_TIJEKU | OCISCENO | SLUZBENA_SANACIJA | ODBACENO"
        boolean provjerena
        varchar nacin_sanacije "UDRUGA | SLUZBENA, može biti NULL"
        varchar url_foto_sanacija "može biti NULL"
        timestamptz datum_kreiranja
    }

    STATUS_LOG {
        bigint id_surogat_log PK
        bigint id_prijava FK
        bigint id_korisnik_promjena FK
        varchar status_stari "NULL kod prvog zapisa"
        varchar status_novi
        timestamptz datum_vrijeme
        text napomena "može biti NULL"
    }

    AKCIJA {
        bigint id_akcija PK
        bigint id_udruga FK "korisnik s ulogom UDRUGA"
        varchar akcija_naziv
        text akcija_opis "može biti NULL"
        timestamptz datum_vrijeme
        numeric latituda "mjesto okupljanja"
        numeric longituda "mjesto okupljanja"
        int maxbr_volonteri "veće od 0"
        varchar status_akcija "PLANIRANO | ZATVARANJE_ZATRAZENO | ZAVRSENO | OTKAZANO"
        text razlog_otkazivanja "može biti NULL"
        varchar id_google_event "kalendar udruge, može biti NULL"
        varchar url_foto_dokaz "obavezno za ZATVARANJE_ZATRAZENO i ZAVRSENO"
    }

    AKCIJA_PRIJAVA {
        bigint id_akcija PK, FK
        bigint id_prijava PK, FK
    }

    VOLONTER_PRIJAVA {
        bigint id_korisnik PK, FK
        bigint id_akcija PK, FK
        timestamptz datum_prijave
        varchar id_google_event "kalendar volontera, može biti NULL"
    }

    OBAVIJEST {
        bigint id_obavijest PK
        bigint id_korisnik FK "primatelj"
        bigint id_prijava FK "može biti NULL"
        bigint id_akcija FK "može biti NULL"
        varchar tip "STATUS_PRIJAVE | PRIJAVA_ODBACENA | AKCIJA_IZMIJENJENA | AKCIJA_OTKAZANA | SANACIJA_ODBIJENA"
        text poruka
        timestamptz datum
        boolean procitana
    }

    KORISNIK ||--o{ PRIJAVA : "podnosi"
    KATEGORIJA ||--o{ PRIJAVA : "razvrstava"
    KORISNIK ||--o| GOOGLE_TOKEN : "ima"
    KORISNIK ||--o{ AKCIJA : "organizira (udruga)"
    PRIJAVA ||--o{ STATUS_LOG : "ima povijest"
    KORISNIK ||--o{ STATUS_LOG : "mijenja status"
    AKCIJA ||--o{ AKCIJA_PRIJAVA : "obuhvaća"
    PRIJAVA ||--o{ AKCIJA_PRIJAVA : "uključena u"
    KORISNIK ||--o{ VOLONTER_PRIJAVA : "volontira"
    AKCIJA ||--o{ VOLONTER_PRIJAVA : "ima volontere"
    KORISNIK ||--o{ OBAVIJEST : "prima"
    PRIJAVA |o--o{ OBAVIJEST : "odnosi se na"
    AKCIJA |o--o{ OBAVIJEST : "odnosi se na"
```

## Veze

| # | Veza | Kardinalnost | Realizacija | Značenje |
| --- | --- | --- | --- | --- |
| 1 | `KORISNIK` podnosi `PRIJAVA` | 1 : N | `prijava.id_korisnik` → `korisnik` | Korisnik ima 0 ili više prijava, prijava ima točno jednog prijavitelja |
| 2 | `KATEGORIJA` razvrstava `PRIJAVA` | 1 : N | `prijava.id_kategorija` → `kategorija` | Prijava ima točno jednu kategoriju |
| 3 | `KORISNIK` ima `GOOGLE_TOKEN` | 1 : 0..1 | `google_token.id_korisnik` (PK i FK) | Najviše jedan token po korisniku; briše se zajedno s korisnikom (`ON DELETE CASCADE`) |
| 4 | `KORISNIK` (udruga) organizira `AKCIJA` | 1 : N | `akcija.id_udruga` → `korisnik` | Akciju organizira točno jedna udruga |
| 5 | `PRIJAVA` ima povijest `STATUS_LOG` | 1 : N | `status_log.id_prijava` → `prijava` | Svaka promjena statusa je jedan zapis |
| 6 | `KORISNIK` mijenja status u `STATUS_LOG` | 1 : N | `status_log.id_korisnik_promjena` → `korisnik` | Tko je promijenio status |
| 7 | `AKCIJA` obuhvaća `PRIJAVA` | M : N | spojna tablica `AKCIJA_PRIJAVA` | Akcija čisti jedno ili više odlagališta; odlagalište kroz vrijeme može biti u više akcija (npr. nakon otkazivanja) |
| 8 | `KORISNIK` volontira na `AKCIJA` | M : N | spojna tablica `VOLONTER_PRIJAVA` (+ `datum_prijave`, `id_google_event`) | Volonter na više akcija, akcija s više volontera |
| 9 | `KORISNIK` prima `OBAVIJEST` | 1 : N | `obavijest.id_korisnik` → `korisnik` | Obavijest ima točno jednog primatelja |
| 10 | `OBAVIJEST` se odnosi na `PRIJAVA` | N : 0..1 | `obavijest.id_prijava` (NULL dopušten) | Obavijest može, ali ne mora biti vezana uz prijavu |
| 11 | `OBAVIJEST` se odnosi na `AKCIJA` | N : 0..1 | `obavijest.id_akcija` (NULL dopušten) | Obavijest može, ali ne mora biti vezana uz akciju |

`KORISNIK` se u dijagramu pojavljuje u više uloga (prijavitelj, organizator, volonter, autor promjene statusa, primatelj obavijesti). Uloga je opisana nazivom veze, a ne zasebnim entitetom, jer je u bazi jedna tablica `korisnik` sa stupcem `uloga`.

## Što se promijenilo u odnosu na prvi dizajn

- Tablica `prijava` više nema stupac `nalog_broj` ni ograničenje `ck_prijava_nalog` (uklonjeno u `V3`).
- Dodan je stupac `prijava.nacin_sanacije`: redar odlučuje ide li prijava udrugama ili na službenu sanaciju.
- Svi identifikatori su `BIGINT` (Java `Long`).

Detaljan opis atributa i pravila je u [`db_dokumentacija.md`](db_dokumentacija.md).
