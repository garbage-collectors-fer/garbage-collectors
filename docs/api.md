# API EcoSentry (prijedlog)

Ovo je prijedlog dogovora između frontenda i backenda. Dok backend nije gotov, frontend radi s lažnim podacima istog oblika, a kasnije se samo prebaci na prave pozive. Ako se nešto promijeni, mijenja se ovdje, da svi rade prema istoj verziji.

ID-jevi zahtjeva (F-xxx) odnose se na 2-Analiza-zahtjeva.md.

## Opća pravila

- Svi endpointi počinju s `/api`.
- Podaci se šalju i primaju kao JSON, osim kad se šalje slika. Tada se koristi `multipart/form-data`.
- Imena polja pišu se u camelCaseu (`slikaUrl`, `brojVolontera`).
- Datumi su u ISO 8601 formatu u UTC-u, npr. `"2026-10-20T14:32:00Z"`.
- Prijavljeni korisnik prepoznaje se preko sesijskog kolačića, pa frontend uz svaki poziv šalje `credentials: "include"`. Ako backend odluči koristiti JWT, ovo se mijenja.
- Greške imaju oblik `{ "poruka": "Opis greške za korisnika" }`.

Statusni kodovi:

| Kod | Značenje |
| --- | --- |
| 200 | U redu |
| 201 | Nešto je stvoreno (nova prijava, akcija...) |
| 400 | Neispravni podaci (nedostaje polje, kriva kategorija...) |
| 401 | Korisnik nije prijavljen |
| 403 | Korisnik nema pravo na tu radnju ili je blokiran |
| 404 | Ne postoji |
| 409 | Sukob, npr. akcija je popunjena |

## Modeli podataka

### Korisnik

```json
{
  "id": 5,
  "ime": "Ana Horvat",
  "email": "ana@gmail.com",
  "uloga": "GRADANIN",
  "blokiran": false,
  "razlogBlokade": null,
  "brojPrijava": 12,
  "brojOdbacenih": 1
}
```

`uloga`: `GRADANIN`, `UDRUGA`, `REDAR`

Za udrugu se dodaje i `"nazivUdruge": "Zelena akcija"`. Polja `brojPrijava` i `brojOdbacenih` vraćaju se samo redaru.

### Prijava

```json
{
  "id": 17,
  "lat": 45.8150,
  "lng": 15.9819,
  "adresa": "Ilica 242, Zagreb",
  "kategorija": "GLOMAZNI",
  "status": "PRIJAVLJENO",
  "provjerena": false,
  "nacinSanacije": null,
  "slikaUrl": "https://.../prijave/17.jpg",
  "slikaSanacijeUrl": null,
  "datum": "2026-10-20T14:32:00Z",
  "prijavitelj": { "id": 5, "ime": "Ana Horvat" },
  "akcijaId": null
}
```

`kategorija`: `PLASTIKA`, `GRADEVINSKI`, `GLOMAZNI`, `OSTALO`

`status`: `PRIJAVLJENO`, `ODBACENO`, `AKCIJA_U_TIJEKU`, `SLUZBENA_SANACIJA`, `OCISCENO`

Boja pribadače na karti (F-011): `PRIJAVLJENO` je crvena, `AKCIJA_U_TIJEKU` je žuta, a `OCISCENO` je zelena. Prijave sa statusom `ODBACENO` i `SLUZBENA_SANACIJA` uklanjaju se iz sustava: ne prikazuju se na karti ni u popisima, jer se službena sanacija dalje rješava izvan aplikacije.

`provjerena` govori je li redar pregledao prijavu. Nova prijava je odmah na karti, ali u redarovom popisu za provjeru ostaje dok je ne prihvati ili odbaci.

`nacinSanacije`: `null` (redar još nije odlučio), `UDRUGA` (čiste volonteri) ili `SLUZBENA` (čisti komunalna tvrtka)

Redar odlučuje u dva koraka. Prvo prihvaća ili odbacuje prijavu (`provjerena`, `ODBACENO`), a zatim za prihvaćenu bira način sanacije. **Eko-udruge vide samo prijave s `nacinSanacije: "UDRUGA"`** i samo njih mogu dodati u akciju.

`prijavitelj` se vraća samo redaru i samom prijavitelju. Ostali ga ne vide.

### Akcija

```json
{
  "id": 4,
  "naziv": "Čišćenje šume kod Gračana",
  "opis": "Ponesite rukavice, vreće osiguravamo.",
  "datumVrijeme": "2026-11-07T09:00:00Z",
  "mjestoOkupljanja": { "lat": 45.8590, "lng": 15.9705, "adresa": "Gračanska cesta 120, Zagreb" },
  "maxVolontera": 15,
  "brojVolontera": 8,
  "status": "PLANIRANA",
  "udruga": { "id": 9, "nazivUdruge": "Zelena akcija" },
  "prijaveIds": [17, 21],
  "prijavljen": true,
  "udaljenostKm": 2.4
}
```

`status`: `PLANIRANA`, `OTKAZANA`, `ZAVRSENA`

`prijavljen` govori je li trenutni korisnik prijavljen kao volonter. `udaljenostKm` se vraća samo kad se akcije traže po lokaciji.

### Prognoza

```json
{
  "dostupna": true,
  "opis": "Jaka kiša",
  "temperatura": 9,
  "nevrijeme": true
}
```

Ako je akcija predaleko u budućnosti, vraća se `{ "dostupna": false }`. Što se smatra nevremenom određuje backend, prema AS-04.

### Obavijest

```json
{
  "id": 31,
  "tekst": "Vaša prijava #17 je očišćena.",
  "procitana": false,
  "datum": "2026-10-22T08:15:00Z",
  "prijavaId": 17,
  "akcijaId": null
}
```

## Endpointi

### Prijava u sustav i računi

| Metoda | Putanja | Tko | Što radi | Zahtjev |
| --- | --- | --- | --- | --- |
| GET | `/api/auth/google` | svi | Preusmjerava na Google prijavu (traži i dozvolu za kalendar) | F-001, F-028, F-029 |
| GET | `/api/auth/google/callback` | svi | Google vraća korisnika ovdje, backend stvara sesiju i preusmjerava na frontend | F-001 |
| POST | `/api/auth/login` | redar | Prijava korisničkim imenom i lozinkom. Tijelo: `{ "korisnickoIme", "lozinka" }` | F-002 |
| POST | `/api/auth/logout` | svi | Odjava | |
| GET | `/api/me` | svi | Vraća trenutnog korisnika ili 401 | F-001 |
| PUT | `/api/me/lozinka` | redar | Promjena lozinke. Tijelo: `{ "staraLozinka", "novaLozinka" }` | F-003 |

### Prijave otpada

| Metoda | Putanja | Tko | Što radi | Zahtjev |
| --- | --- | --- | --- | --- |
| GET | `/api/prijave` | svi | Prijave za kartu i popise, bez odbačenih i onih na službenoj sanaciji. Redar vidi sve ostale, a eko-udruga samo one s `nacinSanacije: "UDRUGA"`. Filteri: `?status=`, `?provjerena=` | F-011, F-016 |
| GET | `/api/prijave/moje` | građanin | Prijave trenutnog korisnika sa statusom | F-009 |
| GET | `/api/prijave/:id` | svi | Detalji jedne prijave | F-012 |
| POST | `/api/prijave` | građanin | Nova prijava. `multipart/form-data`: `slika`, `lat`, `lng`, `kategorija`. Backend sam dohvaća adresu iz koordinata. | F-006, F-007, F-008, F-013 |
| PATCH | `/api/prijave/:id` | redar | Prihvaćanje `{ "provjerena": true }`, odbacivanje `{ "status": "ODBACENO" }`, slanje eko-udrugama `{ "nacinSanacije": "UDRUGA" }` ili promjena kategorije `{ "kategorija": "PLASTIKA" }` | F-016, F-017 |
| POST | `/api/prijave/:id/nalog` | redar | Šalje prihvaćenu prijavu na službenu sanaciju (`status: SLUZBENA_SANACIJA`, `nacinSanacije: SLUZBENA`) i stvara nalog. Vraća nalog `{ "id", "broj", "prijavaId", "datum", "adresa", "kategorija", "slikaUrl" }`. | F-018 |
| GET | `/api/prijave/:id/nalog` | redar | Dohvaća nalog za prijavu | F-018 |
| POST | `/api/prijave/:id/zatvori` | redar | Zatvara prijavu. `multipart/form-data`: `slika` | F-019 |

### Akcije čišćenja

| Metoda | Putanja | Tko | Što radi | Zahtjev |
| --- | --- | --- | --- | --- |
| GET | `/api/akcije?lat=&lng=` | građanin | Nadolazeće akcije poredane po udaljenosti od zadane lokacije | F-026 |
| GET | `/api/akcije/moje` | udruga | Akcije udruge za kalendar, s brojem volontera. Filteri: `?od=&do=` | F-024 |
| GET | `/api/akcije/:id` | svi | Detalji akcije | F-015, F-026 |
| POST | `/api/akcije` | udruga | Nova akcija. Tijelo: `naziv`, `opis`, `datumVrijeme`, `mjestoOkupljanja`, `maxVolontera`, `prijaveIds`. Backend stvara događaj u Google kalendaru udruge. | F-021, F-028 |
| PATCH | `/api/akcije/:id` | udruga | Izmjena akcije. Ako se promijeni termin, backend ažurira kalendare i šalje obavijesti volonterima. | F-022, F-030, F-032 |
| POST | `/api/akcije/:id/otkazi` | udruga | Otkazuje akciju. Prijave se vraćaju u `PRIJAVLJENO`, volonteri dobivaju obavijest. | F-023 |
| POST | `/api/akcije/:id/volonteri` | građanin | Prijava na akciju. Backend stvara događaj u kalendaru volontera. Vraća 409 ako je akcija popunjena. | F-026, F-029 |
| DELETE | `/api/akcije/:id/volonteri` | građanin | Odjava s akcije i brisanje događaja iz kalendara | F-027 |
| GET | `/api/akcije/:id/prognoza` | udruga, građanin | Prognoza za lokaciju i datum akcije | F-031, F-032 |
| POST | `/api/akcije/:id/zahtjev-zatvaranja` | udruga | Nakon akcije šalje sliku očišćene lokacije. `multipart/form-data`: `slika` | F-025 |

### Zahtjevi za zatvaranje (redar)

| Metoda | Putanja | Tko | Što radi | Zahtjev |
| --- | --- | --- | --- | --- |
| GET | `/api/zahtjevi-zatvaranja` | redar | Zahtjevi udruga koji čekaju potvrdu | F-025 |
| POST | `/api/zahtjevi-zatvaranja/:id/potvrdi` | redar | Potvrđuje zahtjev, prijave dobivaju status `OCISCENO` | F-025 |
| POST | `/api/zahtjevi-zatvaranja/:id/odbij` | redar | Odbija zahtjev. Tijelo: `{ "razlog" }` | F-025 |

Oblik zahtjeva: `{ "id", "akcijaId", "prijaveIds", "udruga", "slikaUrl", "datum" }`

### Udruge i korisnici

| Metoda | Putanja | Tko | Što radi | Zahtjev |
| --- | --- | --- | --- | --- |
| POST | `/api/udruge/zahtjevi` | prijavljeni korisnik | Zahtjev da račun postane račun udruge. Tijelo: `{ "nazivUdruge", "opis" }` | F-004 |
| GET | `/api/udruge/zahtjevi` | redar | Zahtjevi koji čekaju odobrenje | F-004 |
| POST | `/api/udruge/zahtjevi/:id/odobri` | redar | Odobrava udrugu | F-004 |
| POST | `/api/udruge/zahtjevi/:id/odbij` | redar | Odbija udrugu | F-004 |
| GET | `/api/korisnici?q=&uloga=` | redar | Pretraga korisnika | F-005 |
| GET | `/api/korisnici/:id` | redar | Detalji korisnika s brojem prijava | F-005 |
| POST | `/api/korisnici` | redar | Kreira račun novog redara. Tijelo: `{ "korisnickoIme", "email", "lozinka" }` | F-002 |
| POST | `/api/korisnici/:id/blokada` | redar | Blokira korisnika. Tijelo: `{ "razlog" }` | F-005 |
| DELETE | `/api/korisnici/:id/blokada` | redar | Uklanja blokadu | F-005 |

Oblik zahtjeva udruge: `{ "id", "korisnik": { "id", "ime", "email" }, "nazivUdruge", "opis", "datum", "status" }`, gdje je `status` jedan od `NA_CEKANJU`, `ODOBREN`, `ODBIJEN`.

### Obavijesti

| Metoda | Putanja | Tko | Što radi | Zahtjev |
| --- | --- | --- | --- | --- |
| GET | `/api/obavijesti` | svi | Obavijesti trenutnog korisnika, najnovije prve | F-010 |
| POST | `/api/obavijesti/:id/procitana` | svi | Označava obavijest kao pročitanu | F-010 |
| POST | `/api/obavijesti/procitaj-sve` | svi | Označava sve kao pročitane | F-010 |

### Statistika

| Metoda | Putanja | Tko | Što radi | Zahtjev |
| --- | --- | --- | --- | --- |
| GET | `/api/statistika?od=&do=` | redar | Statistika za razdoblje | F-020 |

Odgovor:

```json
{
  "poMjesecima": [ { "mjesec": "2026-09", "broj": 34 }, { "mjesec": "2026-10", "broj": 51 } ],
  "ukupno": 85,
  "postotakRijesenih": 62
}
```

## Što ne ide preko našeg backenda

- **Prikaz karte, pretraga adrese (F-014) i ruta do mjesta okupljanja (F-015)** rade se na frontendu, izravno preko Google Maps JavaScript API-ja. Backend tu ne sudjeluje.
- **Google Calendar i OpenWeatherMap** poziva samo backend. API ključevi tako ostaju na serveru, a frontend dobiva samo gotove podatke (npr. `/api/akcije/:id/prognoza`).

## Otvorena pitanja za dogovor

- Sesijski kolačić ili JWT?
- Prijavljuje li se i redar preko Googlea, ili samo lozinkom (AS-01)?
- Treba li udruzi poseban status "na čekanju" dok redar ne odobri zahtjev, ili ostaje `GRADANIN` do odobrenja?
- Što točno vraća `/api/prijave/:id/nalog` i treba li nalog biti PDF (AS-05)?
- Treba li `/api/prijave` stranicu po stranicu (paginaciju) ili vraća sve? Za jedan grad vjerojatno je dovoljno vratiti sve.
