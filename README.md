# EcoSentry

EcoSentry omogućuje građanima da s terena prijave divlje odlagalište otpada, a komunalnim redarima i eko-udrugama da te prijave provjere i organiziraju njihovu sanaciju.

**Projekt na kolegiju:** Ovu aplikaciju razvija studentski tim **Garbage Collectors** (G01, tim 1.2) u sklopu kolegija [Programsko inženjerstvo](https://www.fer.unizg.hr/predmet/proinz) na Fakultetu elektrotehnike i računarstva Sveučilišta u Zagrebu (FER).

## Opis aplikacije

Divlja odlagališta često ostaju neprijavljena jer građani ne znaju kome se obratiti, a eko-udruge i komunalne službe nemaju zajednički pregled prijava. EcoSentry povezuje **građane** koji prijavljuju odlagališta fotografijom i lokacijom, **komunalne redare** koji prijave provjeravaju i po potrebi izdaju službeni nalog te **eko-udruge** koje organiziraju akcije čišćenja s volonterima. Svaka prijava ima vidljiv status na karti, od prijave do sanacije.

**Status:** Projekt je u fazi analize zahtjeva; aplikacija još nije implementirana.

**Planirane ključne funkcionalnosti**

- Prijava odlagališta s fotografijom, lokacijom i kategorijom otpada
- Karta prijava s oznakama obojenima prema statusu
- Organizacija akcija čišćenja s prijavom volontera, događajem u Google kalendaru i vremenskom prognozom za termin akcije

Za potpuni opseg, zahtjeve, oblikovanje i dokaze ispitivanja pogledajte [docs](docs/Home.md).

<a id="deployment"></a>
## Postavljanje (engl. deployment)

<!-- UPUTA: Ovaj odjeljak opisuje već postavljenu aplikaciju koju se  može otvoriti i isprobati bez lokalnog pokretanja izvornog koda.
Za Iteraciju 1 i Završni pregled navedite konkretne podatke. Provjerite vodi li URL na javno dostupnu pokrenutu aplikaciju i radi li navedeni tijek uporabe. Nikada ne objavljujte lozinke ni pristupne tokene. -->

**Javno dostupna aplikacija:** još nije postavljena (planirano za predaju prvog ciklusa, 20. 11. 2026.).

[Vodič za postavljanje i pokretanje](docs/6-Postavljanje-instalacija-i-konfiguracija.md) opisuje smještaj aplikacije (engl. hosting) koji tim stvarno koristi.

<a id="quick-start"></a>
## Brzi početak / instalacija

<!-- Obavezno od Demo 1 nadalje. Zamijenite mjesta za unos naredbama koje je drugi član tima uspješno provjerio nakon čistog kloniranja repozitorija. Detaljne upute za administraciju držite u projektnoj dokumentaciji u direktoriju docs/. -->

Upute za lokalno pokretanje bit će dodane s prvom funkcionalnom inačicom.

**Konfiguracija:** Potrebne varijable okruženja navedene su u [`.env.example`](.env.example). Kopirajte je u `.env` i upišite vlastite vrijednosti. Datoteka `.env` se ne commita, a API ključevi i lozinke ne objavljuju se u repozitoriju, dokumentaciji ni porukama.

## Tehnologije

Vanjske usluge određene su projektnim zadatkom. Programski jezik, radni okvir, baza podataka i platforma za smještaj još se dogovaraju s asistentom.

| Tehnologija ili alat | Uloga u ovom projektu | Razlog uporabe ili važno ograničenje |
| --- | --- | --- |
| Google (OpenID Connect / OAuth 2.0) | Prijava korisnika | Prijava putem vanjskog pružatelja identiteta obavezna je na kolegiju |
| Google Maps API | Karta prijava, oznake prema statusu, geokodiranje, lokacija okupljanja | Zahtijeva se projektnim zadatkom |
| Google Calendar API | Događaj za akciju čišćenja i prijavljene volontere | Zahtijeva se projektnim zadatkom; potreban je pristanak korisnika na pristup kalendaru |
| OpenWeatherMap API | Prognoza za lokaciju i termin akcije, upozorenje na nevrijeme | Zahtijeva se projektnim zadatkom |

<a id="team-members"></a>
## Članovi tima

| Član | GitHub | Glavna uloga ili doprinos |
| --- | --- | --- |
| Tibor Andreani | [dopuniti] | Voditelj tima |
| Bruno Hrgovan | [dopuniti] | [dopuniti] |
| Pavao Maršić | [dopuniti] | [dopuniti] |
| Ivana Markovinović | [dopuniti] | [dopuniti] |
| Nikola Mihanović | [nikola266](https://github.com/nikola266) | [dopuniti] |
| Leo Žigman | [dopuniti] | [dopuniti] |
| Aki Pandžić | [dopuniti] | [dopuniti] |

Uloge se tijekom projekta mogu mijenjati. Repozitorij i GitHub Issues služe kao dodatni dokazi timskog rada.

## Doprinos projektu

- Značajan rad počinje [Issueom](https://github.com/garbage-collectors-fer/garbage-collectors/issues) koji ima opis, očekivani rezultat i nositelja.
- Grana `master` je stabilna i u nju se ne pusha izravno; za svaki zadatak otvara se kratkotrajna grana (npr. `feature/prijava-odlagalista`, `fix/karta`, `docs/obrasci-uporabe`).
- Promjene ulaze u `master` kroz pull request povezan s Issueom (`Closes #12`), koji pregleda barem još jedan član tima.
- Poruke commitova imaju prefiks vrste promjene: `feat:`, `fix:`, `docs:`, `ci:`, `chore:`.

<a id="license"></a>

**Status licence:** Tim još nije odabrao licencu; dok to ne učini, nije dodijeljena licenca koja dopušta javnu ponovnu uporabu koda.

Dokumentacijski predložak kolegija sadrži otvorene obrazovne sadržaje (engl. Open Educational Resources, OER) i licenciran je licencom Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International. Ta licenca **ne određuje automatski licencu studentske aplikacije**.

<a id="ai-usage"></a>
## Uporaba umjetne inteligencije [![AI Usage: Disclosed](https://img.shields.io/badge/AI%20Usage-Disclosed-blue.svg)](https://www.fer.unizg.hr/_download/repository/Policy%20on%20the%20appropriate%20use%20of%20artificial%20intelligence%20at%20the%20faculty%20of%20electrical%20engineering%20and%20computing%5B1%5D.pdf)

Ovaj projekt slijedi FER-ova [pravila o primjerenoj uporabi umjetne inteligencije](https://www.fer.unizg.hr/_download/repository/Policy%20on%20the%20appropriate%20use%20of%20artificial%20intelligence%20at%20the%20faculty%20of%20electrical%20engineering%20and%20computing%5B1%5D.pdf).

**Izjava:** Alat Claude (Anthropic) korišten je pri postavljanju repozitorija: prilagodbi workflowa, izradi ovog README-a prema predlošku kolegija, predložaka za pull requestove i Issuese te `.gitignore` i `.env.example`. Ime tima, članove i temu zadao je tim, a nastali tekst pregledao je Nikola Mihanović. Detaljan zapis nalazi se u [projektnoj dokumentaciji](docs/Home.md#izjava-o-uporabi-umjetne-inteligencije).

<a id="code-of-conduct-and-support"></a>
## Kodeks ponašanja i podrška [![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](CODE_OF_CONDUCT.md)

Od članova tima očekuje se pridržavanje **Kodeksa ponašanja studenata** Fakulteta elektrotehnike i računarstva Sveučilišta u Zagrebu, pravila timskog rada na kolegiju i [Etičkog kodeksa IEEE-a](https://www.ieee.org/about/corporate/governance/p7-8.html). Pogledajte i [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md).

---

Struktura dokumentacije prilagođena je predlošku kolegija Programsko inženjerstvo FER-a autora [Vlade Sruka](https://www.fer.unizg.hr/vlado.sruk), licenciranom pod [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/). Aplikaciju i njezin sadržaj izrađuje gore navedeni studentski tim.
