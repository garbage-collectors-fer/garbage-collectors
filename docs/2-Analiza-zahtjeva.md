# 2. Analiza zahtjeva

Prioriteti su zadani po MoSCoW metodi: Must (mora biti), Should (trebalo bi biti), Could (može biti ako stignemo) i Won't (ne radimo).

**MVP** čine svi zahtjevi s prioritetom Must: F-001, F-002, F-004, F-006 do F-012, F-015, F-016, F-019, F-021, F-025, F-026, F-028, F-029, F-031 i F-032. MVP omogućuje osnovni tok aplikacije: građanin prijavi otpad, redar provjeri prijavu, udruga od nje napravi akciju čišćenja, volonteri se prijave na akciju uz upis u kalendar i prognozu, a nakon čišćenja prijava se zatvara.

## 2.1 Funkcijski zahtjevi

### Prijava u sustav i korisnički računi

| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja |
| --- | --- | --- | --- | --- |
| F-001 | Korisnik se može prijaviti u sustav preko vanjskog servisa za autentifikaciju (OAuth 2.0, Google). | Must | Zadatak | Korisnik se prijavi Google računom i dobije pristup radnjama svoje uloge. Ako odustane od prijave, te radnje mu ostaju nedostupne. |
| F-002 | Administrator (komunalni redar) može kreirati račun drugog komunalnog redara s korisničkim imenom, lozinkom i e-mail adresom. | Must | Zadatak | Novi korisnik se može prijaviti s dodijeljenim podacima i ima prava dodijeljene uloge. |
| F-003 | Korisnik koji ima lozinku može je promijeniti uz unos stare lozinke. | Should | Zadatak | Nakon promjene prijava radi samo s novom lozinkom. Ako stara lozinka nije točna, promjena se ne sprema. |
| F-004 | Eko-udruga može poslati zahtjev za račun, a redar ga odobrava ili odbija. | Must | Zadatak | Dok zahtjev nije odobren, račun nema prava udruge. Nakon odobrenja udruga može kreirati akcije. |
| F-005 | Redar može blokirati korisnika uz upisan razlog. | Should | Zadatak | Blokirani korisnik ne može podnositi prijave niti se prijavljivati na akcije. Redar može ukloniti blokadu. |

### Prijava otpada

| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja |
| --- | --- | --- | --- | --- |
| F-006 | Građanin može podnijeti prijavu otpada s lokacijom, fotografijom i kategorijom otpada (plastika, građevinski, glomazni, ostalo). | Must | Zadatak | Prijava bez lokacije, fotografije ili kategorije se ne sprema i korisnik vidi što nedostaje. Spremljena prijava dobiva ID i status Prijavljeno. |
| F-007 | Lokacija prijave automatski se uzima iz GPS-a uređaja, a korisnik je može ručno ispraviti ili odabrati na karti. | Must | Zadatak | Ako korisnik dopusti lokaciju, pribadača se postavi na njegovu poziciju. Ako ne dopusti, i dalje može podnijeti prijavu odabirom lokacije na karti. |
| F-008 | Fotografija se može dodati kamerom uređaja ili iz galerije. | Must | Zadatak | Na mobitelu se nude obje opcije. Učitana slika vidljiva je u detaljima prijave. |
| F-009 | Građanin vidi popis svojih prijava s trenutnim statusom. | Must | Zadatak | Popis sadrži sve prijave korisnika i status svake prijave odgovara onom u sustavu. |
| F-010 | Građanin dobiva obavijest unutar aplikacije kad se promijeni status njegove prijave. | Must | Zadatak | Nakon promjene statusa obavijest se pojavi kod prijavitelja pri sljedećem otvaranju aplikacije. |

### Karta

| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja |
| --- | --- | --- | --- | --- |
| F-011 | Sustav prikazuje prijave na Google karti kao pribadače obojane po statusu (crveno - Prijavljeno, žuto - Akcija u tijeku, zeleno - Očišćeno). | Must | Zadatak | Svaka prihvaćena prijava ima pribadaču na svojoj lokaciji i boja odgovara statusu. Odbačene prijave se ne prikazuju. |
| F-012 | Klikom na pribadaču prikazuju se detalji prijave. | Must | Zadatak | Odabirom pribadače otvaraju se detalji (fotografija, kategorija, adresa, status, datum). |
| F-013 | Sustav iz koordinata prijave dohvaća tekstualnu adresu. | Should | Zadatak | Uz svaku prijavu prikazuje se adresa. |
| F-014 | Korisnik može unijeti lokaciju prijave upisivanjem adrese. | Should | Zadatak | Upisana adresa postavlja pribadaču na odgovarajuće mjesto na karti. |
| F-015 | Sustav prikazuje mjesto okupljanja akcije na karti s rutom dolaska od trenutne lokacije korisnika. | Must | Zadatak | Volonter na akciji vidi mjesto okupljanja i ucrtanu rutu do njega. |

### Komunalni redar

| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja |
| --- | --- | --- | --- | --- |
| F-016 | Redar vidi popis novih prijava i može ih prihvatiti ili odbaciti. | Must | Zadatak | Odbačena prijava nestaje s karte i prijavitelj dobiva obavijest. Korisnik koji nije redar ne može izvršiti te radnje. |
| F-017 | Redar može promijeniti kategoriju otpada u prijavi. | Should | Zadatak | Nova kategorija vidljiva je svim korisnicima u detaljima prijave. |
| F-018 | Redar može prijavu poslati na službenu sanaciju, pri čemu sustav generira službeni nalog. | Should | Zadatak | Status prijave postaje Službena sanacija, nalog sadrži ID, lokaciju, adresu, kategoriju i fotografije, a udruge tu prijavu ne mogu dodati u akciju. |
| F-019 | Redar može zatvoriti prijavu uz fotografiju očišćene lokacije. | Must | Zadatak | Status prijave postaje Očišćeno i prijavitelj dobiva obavijest. |
| F-020 | Redar vidi statistiku poput broja prijava po mjesecima i postotka riješenih prijava. | Should | Zadatak | Brojke odgovaraju podacima u bazi za odabrano razdoblje. |

### Eko-udruga i akcije čišćenja

| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja |
| --- | --- | --- | --- | --- |
| F-021 | Udruga može kreirati akciju čišćenja odabirom jedne ili više prijava na karti, uz naziv, opis, najveći broj volontera, datum, vrijeme i mjesto okupljanja. | Must | Zadatak | Akcija se sprema i prikazuje u kalendaru udruge. Odabrane prijave dobivaju status Akcija u tijeku. |
| F-022 | Udruga može izmijeniti svoju akciju (naziv, opis, broj volontera, datum i vrijeme). | Should | Zadatak | Izmjene su vidljive volonterima. |
| F-023 | Udruga može otkazati svoju akciju. | Should | Zadatak | Prijave se vraćaju u status Prijavljeno, a prijavljeni volonteri dobivaju obavijest. |
| F-024 | Udruga vidi kalendar svojih akcija s brojem prijavljenih volontera. | Should | Zadatak | Svaka akcija udruge nalazi se na svom datumu i prikazuje popunjenost. |
| F-025 | Nakon akcije udruga učitava fotografiju očišćene lokacije i šalje zahtjev za zatvaranje prijave. | Must | Zadatak | Kad redar potvrdi zahtjev, prijave dobivaju status Očišćeno i prijavitelji dobivaju obavijest. |

### Volontiranje

| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja |
| --- | --- | --- | --- | --- |
| F-026 | Građanin vidi popis nadolazećih akcija čišćenja, s popunjenošću i može se prijaviti na akciju. | Must | Zadatak | Nakon prijave broj volontera se poveća za jedan. Na popunjenu akciju prijava nije moguća. |
| F-027 | Volonter se može odjaviti s akcije. | Should | Zadatak | Nakon odjave broj volontera se smanji, a događaj se uklanja iz njegovog kalendara. |

### Vanjske integracije

| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja |
| --- | --- | --- | --- | --- |
| F-028 | Kad udruga kreira akciju, sustav automatski kreira događaj u Google kalendaru udruge. | Must | Zadatak | Događaj sadrži točan termin, poveznicu na lokaciju na karti, kratke upute i podsjetnik 2 sata prije početka. |
| F-029 | Kad se građanin prijavi kao volonter, sustav automatski kreira događaj u njegovom Google kalendaru. | Must | Zadatak | Događaj sadrži točan termin, poveznicu na lokaciju na karti, kratke upute i podsjetnik 2 sata prije početka. |
| F-030 | Kad se termin akcije promijeni, sustav ažurira događaje u Google kalendarima udruge i volontera. | Should | Zadatak | Nakon promjene termina događaj u kalendaru pokazuje novi termin. |
| F-031 | Sustav dohvaća vremensku prognozu s OpenWeatherMap za lokaciju i datum akcije i prikazuje je udruzi i volonterima. | Must | Zadatak | Uz akciju se prikazuje prognoza za taj dan na toj lokaciji. Ako prognoza još nije dostupna, prikazuje se poruka o tome. |
| F-032 | Ako je za termin akcije najavljeno nevrijeme, sustav prikazuje crveno upozorenje i nudi udruzi brzu odgodu ili promjenu termina. | Must | Zadatak | Kod nevremena se prikaže upozorenje. Udruga može iz upozorenja odabrati novi termin, a volonteri dobivaju obavijest o promjeni. |

### Izvan opsega ove verzije

| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja |
| --- | --- | --- | --- | --- |
| F-033 | Sustav šalje push obavijesti na uređaj korisnika. | Won't | Interpretacija zadatka |  Obavijesti se prikazuju unutar aplikacije. |
| F-034 | Sustav šalje obavijesti e-mailom. | Won't | Interpretacija zadatka | Obavijesti se prikazuju unutar aplikacije. |
| F-035 | Sustav podržava više gradova s odvojenim redarima. | Won't | Interpretacija zadatka | Sustav je za jedan grad |
| F-036 | Sustav automatski šalje službeni nalog komunalnoj tvrtki. | Won't | Interpretacija zadatka | Nije specifirano kako se šalje nalog. |

## 2.2 Nefunkcijski zahtjevi

| ID | Opis | Prioritet | Izvor | Način provjere |
| --- | --- | --- | --- | --- |
| NF-01 | Sučelje je responzivno. Sve radnje građanina mogu se obaviti na mobitelu širine 360 px bez vodoravnog pomicanja stranice. | Must | Zadatak | Izvršiti radnje građanina na mobitelu i u Chrome DevTools prikazu za mobitel. |
| NF-02 | Radnje redara i udruge dostupne su samo korisnicima s tom ulogom. | Must | Zadatak | Poslati zahtjev za radnju redara kao obični građanin i provjeriti da ga poslužitelj odbija. |
| NF-03 | Aplikacija radi preko HTTPS-a. | Must | Tehničko ograničenje (geolokacija i kamera u pregledniku rade samo preko HTTPS-a) | Provjeriti da se aplikacija otvara preko HTTPS-a. |
| NF-04 | Lozinke se u bazi spremaju samo kao sažetak (hash), nikad kao čisti tekst. | Must | Sigurnost | Pregledati tablicu korisnika u bazi. |
| NF-05 | Sustav prihvaća samo slikovne datoteke (JPG, PNG) do 10 MB. | Should | Prijedlog tima | Pokušati učitati PDF i sliku veću od 10 MB i provjeriti da sustav to odbija s porukom. |
| NF-06 | Ako vanjski servis (npr. prognoza) ne odgovara, ostatak aplikacije radi normalno i korisnik vidi poruku da podatak trenutno nije dostupan. | Should | Prijedlog tima | Postaviti neispravan API ključ za prognozu i provjeriti da prijave i akcije i dalje rade. |
| NF-07 | Aplikacija radi u zadnjim verzijama preglednika Chrome, Firefox i Edge te u Safariju na iPhoneu. | Should | Prijedlog tima | Proći kroz glavne radnje u svakom pregledniku. |

## 2.3 Dionici i akteri

| ID uloge ili aktera | Odnos prema sustavu | Relevantni zahtjevi |
| --- | --- | --- |
| A-01 Građanin | Korisnik. Prijavljuje otpad, prati svoje prijave i prijavljuje se na akcije kao volonter. | F-001, F-006 do F-015, F-026, F-027, F-029, F-031 |
| A-02 Eko-udruga | Korisnik. Organizira akcije čišćenja i potvrđuje sanaciju. | F-001, F-004, F-011 do F-015, F-021 do F-025, F-028, F-030 do F-032 |
| A-03 Komunalni redar | Korisnik i administrator. Provjerava prijave, upravlja korisnicima i šalje prijave na službenu sanaciju. | F-002, F-005, F-011, F-012, F-016 do F-020, F-025 |
| A-04 Google Maps, Google Calendar, OpenWeatherMap | Vanjski sustavi s kojima aplikacija komunicira. | F-001, F-011, F-013 do F-015, F-028 do F-032 |
| Komunalna tvrtka | Dionik. Ne koristi aplikaciju, ali prima službene naloge koje generira redar. | F-018 |

## 2.4 Ograničenja i pretpostavke

| ID | Tip | Opis ograničenja ili pretpostavke | Izvor | Inženjerska posljedica / Provjera |
| --- | --- | --- | --- | --- |
| C-01 | Ograničenje | Sustav se izrađuje kao web aplikacija, bez zasebne mobilne aplikacije. | Odluka tima | Sučelje za građane mora biti prilagođeno mobitelu. |
| C-02 | Ograničenje | Obavezne su integracije s Google Maps, Google Calendar i OpenWeatherMap API-jem. | Zadatak | Treba nabaviti API ključeve i paziti na ograničenja besplatnih planova. |
| C-03 | Ograničenje | Prijava se mora moći obaviti preko vanjskog servisa (OAuth 2.0). | Zadatak | Backend mora podržati i OAuth prijavu i račune koje kreira administrator. |
| C-04 | Ograničenje | Za upis događaja u Google kalendar korisnik mora imati Google račun i dopustiti pristup kalendaru. | Google Calendar API | Korisnik bez Google računa i dalje može koristiti aplikaciju, ali mu se akcije ne upisuju u kalendar. |
| AS-01 | Pretpostavka | Građani se prijavljuju Google računom, udruge šalju zahtjev za račun koji redar odobrava, a račune redara kreira administrator. | Interpretacija zadatka | Zadatak spominje i račune koje kreira administrator i OAuth. |
| AS-02 | Pretpostavka | Sustav pokriva jedan grad. | Interpretacija zadatka | Ako treba više gradova, prijave i redari moraju se vezati uz područje. |
| AS-03 | Pretpostavka | Prognoza je dostupna samo nekoliko dana unaprijed. | Procjena tima | Provjeriti u dokumentaciji OpenWeatherMap. Za akcije dalje u budućnosti prikazuje se poruka da prognoza još nije dostupna. |
| AS-04 | Pretpostavka | Nevrijeme znači najavljenu jaku kišu, oluju, temperaturu iznad 35 °C ili ispod 0 °C. | Procjena tima | Dogovoriti pragove. |
| AS-05 | Pretpostavka | Službeni nalog se generira i sprema u sustavu, a redar ga sam prosljeđuje komunalnoj tvrtki. Sustav se ne povezuje s tvrtkom. | Procjena tima | Provjeriti detalje zadatka. |

## 2.5 Značajne promjene zahtjeva

| Datum | ID zahtjeva | Promjena i razlog | Dogovoreno s / dokaz |
| --- | --- | --- | --- |
|  |  |  |  |

## 2.6 Sljedivost zahtjeva

Tablica će se popunjavati kad budu gotovi obrasci uporabe, arhitektura i ispitivanja.

| ID zahtjeva | Obrazac uporabe / modul | Arhitekturna realizacija | Ispitivanje ili provjera |
| --- | --- | --- | --- |
|  |  |  |  |

## 2.7 Pregled zahtjeva

| Kontrolna točka | Povratna informacija ili nalaz | Odluka o zahtjevu ili opsegu |
| --- | --- | --- |
| Iteracija 1 |  |  |
| Demo 2 |  |  |
| Završni pregled |  |  |
