# A. Pregled aktivnosti grupe

**Cilj:** Prikazati kako je tim organizirao projekt, raspodijelio rad, reagirao na važne probleme i pridonio rezultatu. Zapisi trebaju opisivati ishode, a ne samo navoditi da je sastanak održan ili da se o nekoj temi raspravljalo.

## A.1 Evidencija sastanaka

**Cilj:** Voditi kratak zapis projektnih sastanaka i tjedne koordinacije: tko je sudjelovao, što je odlučeno i koja je radnja uslijedila. Raspravu koja nije dovela do odluke zabilježite samo ako je važno pitanje ostalo otvoreno.

>Definirati prije prve uporabe:
`[Inicijali/Kratica] = [Ime i prezime]` (npr. *AK = Ana Kovač; LM = Luka Marić; EP = Ema Petrović; NK = Nika Kralj*).																														

| Datum i sudionici | Glavna tema | Donesena odluka ili zadatak  | Poveznica na zadatak ili  rezultat, ako postoji |
| --- | --- | --- | --- |
|  |  |  |  |

Za svaki relevantan sastanak ili zapis tjedne koordinacije upišite jedan sažet redak. Dodijeljeni zadatak treba imati odgovornu osobu; za neriješeno pitanje treba navesti tko će ga dalje obraditi. Sam naslov sastanka ne pokazuje što se promijenilo. U ovu evidenciju nemojte kopirati cijeli popis issuea ni prijepis razgovora.

## A.2 Plan rada

**Cilj:** Prikazati planirani redoslijed rada i odgovornosti u timu. Prikažite projektne tjedne ili druga kratka razdoblja koja tim koristi, uključujući pripremu za formalne provjere.

**Trenutačni plan:** [Poveznica na GitHub Projects ploču, Gantogram ili održavanu tablicu u nastavku. Navesti osobu zaduženu za ažurnost plana. Odaberite jedan glavni prikaz i navedite tko ga održava ažurnim.]

| Razdoblje/Tjedan | Glavni planirani rad | Odgovorni članovi | Poveznica na zadatke |
| --- | --- | --- | --- |
|  |  |  |  |

Ako koristite tablicu, plan vodite na korisnoj tjednoj razini i ažurirajte ga kada se prioriteti promijene. Kratice članova tima definirajte  u A.1 i ovdje ih primjenjujte dosljedno; ako dva člana imaju iste inicijale, proširite kraticu. Plan nije dokaz da je planirani rad dovršen (to dokazuje kod i dokumentacija).

## A.3 Aktivnosti i doprinosi članova

Pripremljen je lokalni prototip stranice eko-udruge prema stilu stranice komunalnog redara. Dodani su prikaz akcija, dostupnih odlagališta i detalja odabrane stavke te je uređen izgled sučelja. Pripremljen je i paket od deset SVG ikonica s React komponentom i kratkim uputama za ostale članove frontend tima.

**Cilj:** Prikazati koji su članovi radili na važnim projektnim aktivnostima i približan trud koji prijavljuju. Uz implementaciju uključite oblikovanje, dokumentaciju, integraciju, ispitivanje i postavljanje.

| Aktivnost ili rezultat | Član | Prijavljeni sati | Reprezentativni rezultat ili poveznica |
| --- | --- | --- | --- |
| Opseg projekta i analiza zahtjeva (dok. 1 i 2), kasnije usklađivanje zahtjeva s odlukama tima i ispravci | Ivana Markovinović | 2.5 | PR #23, #24; `docs/1-Projekt.md`, `docs/2-Analiza-zahtjeva.md` |
| Prijedlog REST API-ja između klijenta i poslužitelja | Ivana Markovinović | 0.5 | `docs/api.md` |
| Stranica komunalnog redara (popis prijava, uređivanje prijava, odluka o sanaciji) | Ivana Markovinović | 4 | PR #11; `KomunalniRedar.jsx` |
| Zajednička komponenta karte | Ivana Markovinović | 2 | PR #11, #19; `KartaPrijava.jsx` |
| Prijava Google računom na klijentu, prikaz stranice prema ulozi | Ivana Markovinović | 2 | PR #13; `Prijava.jsx`, `App.jsx`, `autentikacijaServis.js` |
| Spajanje klijenta na poslužitelj | Ivana Markovinović | 2 | PR #18, #20, #27; `prijaveServis.js` |
| Stranica građanina: nova prijava s lokacijom, kategorijom i fotografijom, moje prijave, prilagodba za mobitel | Ivana Markovinović | 4 | PR #19, #22; `Gradjanin.jsx`, `Gradjanin.css` |
| Usklađivanje obrazaca uporabe s novim zahtjevima | Ivana Markovinović | 0.5 | PR #24; `docs/3-Obrasci-uporabe.md` |
| README repozitorija i naslovnica dokumentacije | Ivana Markovinović | 1.5 | PR #26, #29; `README.md`, `docs/Home.md` |
| PDF dokumentacije za prvi ciklus | Ivana Markovinović | 1 | PR #35; `docs/deliverables/PROINZ26_G01.2_EcoSentry_v1.pdf` |
| Rad na stranici gradjanina | Aki Pandžić | 4 | `Gradjanin.jsx`, `Gradjanin.css` |
| Rad na dokumentaciji | Aki Pandžić | 1 | `docs/1-Projekt.md`, `docs/2-Analiza-zahtjeva.md`, `docs/3-Obrasci-uporabe.md` |
| Automatskih testovi, ispitivanje sustava i prikupljanje dokaza | Bruno Hrgovan | 3 | `backend/src/test/`, `tests/evidence/` |
| Izrada dokumentacije za ispitivanje i postavljanje sustava (dokumenti 5 i 6) | Bruno Hrgovan | 1 | `docs/5-Ispitivanje.md`, `docs/6-Postavljanje-instalacija-i-konfiguracija.md` |
| Izrada poglavlja 2.6 – Sljedivost zahtjeva | Bruno Hrgovan | 0.5 | `docs/2-Analiza-zahtjeva.md` |
| Dopuna obrazaca uporabe, izrada pripadajućeg UML dijagrama i ažuriranje dokumentacije aktivnosti grupe | Bruno Hrgovan | 2 | `docs/3-Obrasci-uporabe.md`, `docs/puml/3-1-ecosentry-system-UC.puml`, `docs/A-Pregled-aktivnosti-grupe.md` |
| Izrada stranice eko-udruge, uključujući strukturu sučelja i prikaz dostupnih funkcionalnosti | Leo Žigman | 2 | `EkoUdruga.jsx`, `EkoUdruga.css` |
| Implementacija prikaza akcija i dostupnih odlagališta | Leo Žigman | 2.5 | `EkoUdruga.jsx`, `EkoUdruga.css` |
| Implementacija prikaza detalja odabrane stavke i pripadajućih elemenata sučelja | Leo Žigman | 2 | `EkoUdruga.jsx`, `EkoUdruga.css` |
| Izrada paketa od deset SVG ikonica i pripadajuće React komponente | Leo Žigman | 3 | `assets/icons/`, React komponenta za ikonice |
| Izrada kratkih uputa za korištenje i integraciju ikonica za ostale članove frontend tima | Leo Žigman | 1 | Dokumentacija/upute za korištenje ikonica ||
| Uspostava repozitorija iz predloška kolegija i prebacivanje workflowa na `master`; pozivanje članova, asistenta i nositelja kolegija u repozitorij (nositelj ponovno pozvan 15. 11.) | Nikola Mihanović | 2 | PR #1, #2; postavke repozitorija |
| Otvaranje početnih zadataka za obrasce uporabe i prijedlog tehnologija | Nikola Mihanović | 1 | Issue #3–#8 |
| Usklađivanje zahtjeva F-011 sa zadatkom i razdvajanje vanjskih aktera (A-04 do A-07) | Nikola Mihanović | 1 | PR #9; `docs/2-Analiza-zahtjeva.md` |
| Spring Boot poslužitelj: prijava Google računom (OAuth 2.0 / OpenID Connect), sesija, odjava, CSRF zaštita, JSON odgovori 401 i 403, `/api/health` i `/api/me` | Nikola Mihanović | 6 | PR #10; `SecurityConfig`, `KorisnikController`, `application.properties` |
| Google Cloud projekt: OAuth klijent, adrese povratka, testni korisnici, omogućeni Maps i Calendar API, ograničeni Maps ključevi | Nikola Mihanović | 2 | postavke u Google Cloud konzoli |
| Zajednički testni Google računi redara i udruge i njihovo dodavanje kao testnih korisnika (uloge im u bazi postavlja migracija V4) | Nikola Mihanović | 0.5 | `ecosentry.redar`, `ecosentry.udruga` |
| Postavljanje na Render: `Dockerfile` (klijent i poslužitelj u jednoj usluzi), varijable okruženja, automatsko postavljanje s `master` | Nikola Mihanović | 3 | PR #10; `Dockerfile`, `.dockerignore` |
| Prosljeđivanje Google Maps ključa klijentu pri izgradnji na Renderu | Nikola Mihanović | 0.5 | commit `cb9fde0`; `Dockerfile` |
| Poslužiteljska točka `GET /api/kategorije` za izbor kategorije na klijentu i uklanjanje `TestController` | Nikola Mihanović | 1 | PR #28; `KategorijaController` |
| Postavljanje varijabli okruženja za bazu (Neon) i Cloudinary na Renderu, pregled i spajanje PR-a za Cloudinary | Nikola Mihanović | 1 | PR #36 (autor Tibor Andreani) |
| Popravak izgradnje na Renderu koja je padala od 15. 11. (test ovisnosti, prevođenje testova izvan Docker izgradnje) i prilagodba `SlikaServiceTest` Cloudinaryju | Nikola Mihanović | 3 | PR #37, #38; `Dockerfile`, `backend/pom.xml` |
| Uklanjanje ostataka predloška, uravnoteženje prioriteta zahtjeva i podjela aktera i dionika prema napomenama asistenta | Nikola Mihanović | 2 | PR #41, #42; `docs/Home.md`, `docs/1-Projekt.md`, `docs/2-Analiza-zahtjeva.md` |

Koristite aktivnosti specifične za projekt umjesto obaveznog retka za svako poglavlje dokumentacije ili svaki UML dijagram. Tim treba dosljedno bilježiti sate i izbjegavati dvostruko brojanje zajedničkog rada; reprezentativni rezultat objašnjava što je prijavljeni trud proizveo. Sati su samoprijavljena procjena uloženog rada, a ne mjera kvalitete niti zamjena za pregled koda i artefakata.

## A.4 Pregled promjena u repozitoriju

**Cilj:** Prikazati kada su promjene napravljene u repozitoriju i tko ih je napravio, uz napomenu da sam broj zapisa promjena ne mjeri kvalitetu doprinosa.

**Prikaz aktivnosti repozitorija:** [GitHub Insights, Contributors](https://github.com/garbage-collectors-fer/garbage-collectors/graphs/contributors), razdoblje od 16. 10. do 20. 11. 2026.

Graf može pokazati kada su zapisi promjena napravljeni i tko ih je napravio, ali ne prikazuje sav rad na oblikovanju, ispitivanju, integraciji, pregledu ili dokumentaciji. Ako postoji uočljiv nesklad s tablicom aktivnosti, kratko ga objasnite; nemojte iz grafa izvoditi broj sati. Generirani prikaz neka bude vezan uz stvarni repozitorij umjesto da se ručno crta drugi graf.

## A.5 Ključni inženjerski izazovi i rješenja

**Cilj:** Dokumentirati stvarne tehničke i organizacijske prepreke s kojima se tim suočio, poduzete korektivne inženjerske korake te konačni ishod. Odaberite konkretne izazove umjesto općenite pohvale timskog rada.

| Izazov | Poduzeta radnja | Ishod ili preostalo ograničenje |
| --- | --- | --- |
| Izmjena izravno na `master` (11. 11.) uvela je popis dopuštenih e-mail adresa pa se većina članova nije mogla prijaviti na javnoj adresi. | Nikola Mihanović upisao je članove tima u popis bez mijenjanja logike te izmjene (11. 11. i 12. 11.). Tibor Andreani je 14. i 15. 11. popis zamijenio tablicom korisnika u bazi. | Prijava je ponovno radila upisanim članovima, a Leo Žigman i Pavao Maršić dodani su dan kasnije. Popis je uklonjen. |
| Nakon spajanja baze na Neon aplikacija se na Renderu nije pokretala jer varijable za bazu nisu bile postavljene. | Nikola Mihanović postavio je `DB_HOST`, `DB_USER` i `DB_PASSWORD` na Renderu i provjerio zapise pokretanja. | Aplikacija radi s bazom na Neonu. |
| Izgradnja na Renderu padala je od 15. 11.: testovi su dodani bez test ovisnosti (koje je Nikola Mihanović ranije maknuo), a nakon prelaska na Cloudinary jedan test se više nije mogao prevesti. Javna inačica ostala je na starijoj izgradnji. | Dodane su test ovisnosti, prevođenje testova izbačeno je iz Docker izgradnje, a `SlikaServiceTest` prilagođen je novom spremanju slika. | Izgradnja prolazi, javna inačica je ažurna, a svih 44 testa prolazi lokalno. Izgradnja ne provjerava testove, pa ih treba pokretati ručno prije spajanja. |

---

>**Završna provjera:** Sastanci navode smislene ishode i odgovorne osobe; plan odražava namjeravani rad; tablica uloženog rada i generirani prikaz repozitorija odnose na ovaj vidljivi projekt; konkretni izazovi povezani su s radnjama i njihovim rezultatima.