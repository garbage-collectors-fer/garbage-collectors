# EcoSentry — Projektna dokumentacija

**Kolegij:** [Programsko inženjerstvo](https://www.fer.unizg.hr/predmet/proinz), Fakultet elektrotehnike i računarstva Sveučilišta u Zagrebu  
**Akademska godina:** 2026./2027.  
**Tim:** G01, tim 1.2  
**Nastavnik:** Vlado Sruk  
**Asistent / demonstrator:** Goran Rajić

## Pregled projekta

EcoSentry je web aplikacija za prijavu i sanaciju divljih odlagališta otpada. Građani prijavljuju otpad s fotografijom i lokacijom na karti, komunalni redari provjeravaju prijave i odlučuju čiste li ih eko-udruge ili komunalna tvrtka, a eko-udruge organiziraju akcije čišćenja s volonterima. Cilj je da svaka prijava ima vidljiv trag od podnošenja do čišćenja.

**Aplikacija i osnovno postavljanje:** [README repozitorija](../README.md#quick-start)  
**Javno dostupna aplikacija:** pogledajte [README – Postavljanje](../README.md#deployment)

## Članovi tima i uloge

Ažurirani popis članova i njihovih glavnih uloga ili doprinosa nalazi se u [README-u repozitorija](../README.md#team-members).

## Kazalo dokumentacije

| Stranica | Svrha |
| --- | --- |
| [1. Opseg projekta](1-Projekt.md) | Problem, cilj i granice projekta |
| [2. Analiza zahtjeva](2-Analiza-zahtjeva.md) | Zahtjevi, ograničenja i sljedivost |
| [3. Obrasci uporabe](3-Obrasci-uporabe.md) | Akteri i reprezentativne interakcije korisnika |
| [4. Arhitektura i oblikovanje](4-Arhitektura-i-oblikovanje.md) | Glavne odluke oblikovanja, struktura, podaci i ponašanje |
| [5. Ispitivanje](5-Ispitivanje.md) | Pristup ispitivanju, stvarni rezultati i poznati nedostaci |
| [6. Postavljanje, instalacija i konfiguracija](6-Postavljanje-instalacija-i-konfiguracija.md) | Lokalna instalacija, konfiguracija, javno postavljanje i administracija |
| [7. Zaključak i budući rad](7-Zakljucak-i-buduci-rad.md) | Zaključak i moguća daljnja poboljšanja |
| [A. Pregled aktivnosti grupe](A-Pregled-aktivnosti-grupe.md) | Aktivnosti tima, doprinosi i izazovi |
| [Prijedlog API-ja](api.md) | Endpointi poslužitelja i oblik podataka koje koristi korisničko sučelje |

## Ključne točke projekta

| Kontrolna točka | Demonstracija | Video |
| --- | --- | --- |
| Iteracija 1 | https://ecosentry-6rg1.onrender.com | — |
| Završni pregled | [Poveznica na završnu inačicu projekta] | — |

Dokumentacija se kontinuirano ažurira kako se aplikacija razvija.

## Organizacija projekta i razvojni proces

**Način rada:** Tim je podijeljen na frontend (svaki član radi stranicu jedne uloge), backend i dokumentaciju. Zadaci i odluke dogovaraju se na timskim kanalima i sastancima, a svaka promjena radi se na zasebnoj grani i ulazi u `master` preko pull requesta. Promjena na `master` automatski se postavlja na Render.  
**Praćenje trenutačnih zadataka i nedostataka:** [Pull requestovi](https://github.com/garbage-collectors-fer/garbage-collectors/pulls) u repozitoriju.

## Pravila dokumentacije

Dokumentacija se sastoji od međusobno povezanih Markdown stranica u direktoriju `docs/`. UML dijagrami izrađuju se u PlantUML-u: izvor se čuva u `docs/puml/`, a slika u `docs/assets/diagrams/` generira se automatski pri spajanju u `master`. Projekt koristi React i Vite za korisničko sučelje, Spring Boot za poslužitelj, PostgreSQL na Neonu za bazu podataka te Render za postavljanje.

## Akademski integritet, ponašanje i licenciranje

README repozitorija sadrži projektnu [izjavu o uporabi umjetne inteligencije](../README.md#ai-usage), [informacije o kodeksu ponašanja i podršci](../README.md#code-of-conduct-and-support) te [status licence ili ponovne uporabe](../README.md#license). Pristupni podaci i druge tajne nikada se ne objavljuju u dokumentaciji niti dijele u običnim porukama.

## Izjava o uporabi umjetne inteligencije

Kratak sažetak: [README – Uporaba umjetne inteligencije](../README.md#ai-usage). Slijedi FER-ova [pravila o primjerenoj uporabi umjetne inteligencije](https://www.fer.unizg.hr/_download/repository/Policy%20on%20the%20appropriate%20use%20of%20artificial%20intelligence%20at%20the%20faculty%20of%20electrical%20engineering%20and%20computing%5B1%5D.pdf).

### Korišteni alati

| Alat | Inačica ili model | Koristio/la | Glavna svrha |
| --- | --- | --- | --- |
| Claude | Claude Opus | Tim | Organizacija i strukturiranje projekta, izrada nacrta dokumentacije, prijedlog API-ja |

### Opseg doprinosa umjetne inteligencije

| Stranica, datoteka ili artefakt | Vrsta pomoći | Što je alat proizveo | Što je tim zadao i promijenio | Lokacija |
| --- | --- | --- | --- | --- |
| 1. Opseg projekta, 2. Analiza zahtjeva | Izrada nacrta, preoblikovanje | Nacrt teksta i tablica zahtjeva | Tim je zadao temu i dogovorene odluke, odredio prioritete te uklonio i spojio zahtjeve nakon dogovora s asistentom | `docs/1-Projekt.md`, `docs/2-Analiza-zahtjeva.md` |
| 3. Obrasci uporabe | Usklađivanje | Izmjene UC-001, UC-004 i UC-008 nakon promjene zahtjeva | Tim je odlučio da nema lozinki ni službenog naloga | `docs/3-Obrasci-uporabe.md` |
| Prijedlog API-ja | Izrada nacrta | Popis endpointa i oblika podataka | Tim je uskladio rute s backendom | `docs/api.md` |
| 4. Arhitektura i oblikovanje | Izrada nacrta | Nacrt teksta i PlantUML dijagrama prema kodu | Autor je odredio odluke i provjerio sadržaj prema kodu i bazi | `docs/4-Arhitektura-i-oblikovanje.md`, `docs/puml/` |

### Provjera generiranog sadržaja

| Provjera | Kako je provedena | Dokaz |
| --- | --- | --- |
| Činjenična točnost | Opisi funkcionalnosti u README-u i dokumentaciji uspoređeni su s pokrenutom aplikacijom i kodom u repozitoriju | Pull requestovi u repozitoriju |
| Dosljednost s drugim stranicama | Nakon prenumeracije zahtjeva provjereno je da se brojevi u dokumentima 2 i 3 i u `api.md` poklapaju | `docs/2-Analiza-zahtjeva.md`, `docs/3-Obrasci-uporabe.md`, `docs/api.md` |

### Pogreške pronađene u izlazu umjetne inteligencije

| Problem | Kako je pronađen | Rješenje |
| --- | --- | --- |

