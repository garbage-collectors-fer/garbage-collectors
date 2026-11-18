# 1. Opseg projekta

## 1.1 Problem i cilj projekta

Divlja odlagališta otpada i dalje su veliki problem, iako postoji organizirani odvoz smeća. Kad netko naiđe na hrpu otpada, često ne zna kome bi to prijavio. Ako i prijavi, obično ne sazna je li se nakon toga išta dogodilo. Eko-udruge organiziraju akcije čišćenja, ali nemaju jedno mjesto gdje bi vidjele koje su lokacije prijavljene, a koje su već očišćene. Komunalni redari s druge strane dobivaju prijave koje često nemaju točnu lokaciju ili sliku.

Cilj projekta je napraviti web aplikaciju EcoSentry koja povezuje građane, komunalne redare i eko-udruge. Građanin na karti prijavi lokaciju otpada, doda sliku i odabere vrstu otpada. Redar provjeri prijavu i odluči hoće li otpad čistiti volonteri ili komunalna služba. Ako je otpad manji, eko-udruga može od te prijave napraviti akciju čišćenja i pozvati volontere. Prati se status svake prijave.

Od aplikacije očekujemo da građanin može na jednom mjestu prijaviti otpad i pratiti što se s prijavom događa, da redar dobije prijave s lokacijom i slikom na jednom popisu, i da udruga lakše planira akcije i ne ide na mjesta koja su već očišćena.

## 1.2 Ciljani korisnici i dionici

| Skupina korisnika ili dionika | Potreba ili interes relevantan za ovaj projekt |
| --- | --- |
| Građanin | Želi jednostavno prijaviti otpad koji je vidio i znati je li njegova prijava riješena. |
| Građanin kao volonter | Želi sudjelovati u čišćenju svoje okoline i lako saznati kada i gdje se održavaju akcije. |
| Eko-udruga | Želi organizirati akcije čišćenja na mjestima gdje su potrebne i okupiti dovoljno volontera. |
| Komunalni redar (administrator) | Želi dobivati točne i provjerene prijave kako bi brzo odlučio tko će očistiti lokaciju, i spriječiti zloupotrebu sustava. |

## 1.3 Granice projekta

**Uključeno:**
- Prijava otpada s lokacijom (GPS ili odabir na karti), slikom i vrstom otpada.
- Karta s prijavama koje su obojane po statusu (crveno - prijavljeno, žuto - akcija u tijeku, zeleno - očišćeno).
- Provjera i kategoriziranje prijava od strane redara.
- Organiziranje akcija čišćenja od strane eko-udruge.
- Prijava volontera na akcije i kalendar akcija.
- Zatvaranje prijave uz sliku očišćene lokacije i obavijest građaninu.
- Upravljanje korisnicima (odobravanje udruga, blokiranje korisnika) za redara.
- Osnovna statistika.
- Integracije s Google Maps, Google Calendar i OpenWeatherMap.
- Prijava u aplikaciju preko OAuth 2.0.

**Izvan opsega ili odgođeno:**
- Posebna mobilna aplikacija. Dostupna je samo web aplikacija.
- Push i e-mail obavijesti. Obavijesti se vide samo unutar aplikacije.
- Automatsko prepoznavanje otpada na slici. Lažne prijave redar odbacuje ručno.

**Vanjske ovisnosti:**
- Google Maps API za prikaz karte s pribadačama te prikaz rute do mjesta okupljanja.
- Google Calendar API za dodavanje akcija u kalendar organizatora i volontera.
- OpenWeatherMap API za vremensku prognozu na dan akcije.
- OAuth 2.0 prijava.
- Baza podataka i spremište za slike.

## 1.4 Postojeći pristupi i opravdanost projekta

U Hrvatskoj već postoji državni sustav ELOO (Evidencija lokacija odbačenog otpada) preko kojeg građani mogu prijaviti odbačeni otpad, a prijave dalje obrađuju komunalni redari [1]. Postoji i aplikacija TrashOut u kojoj se odlagalište prijavljuje sa slikom na kartu, a korisnici se mogu priključiti akcijama čišćenja [2]. EcoSentry ne pokušava zamijeniti službenu evidenciju. Ideja je da građanin, redar i eko-udruga rade u istoj aplikaciji, tako da provjerena prijava može odmah postati akcija čišćenja s volonterima, kalendarom i prognozom, a građanin vidi kako je njegova prijava riješena.

**Izvori:**
1. Ministarstvo zaštite okoliša i zelene tranzicije, Pregled podataka iz sustava Evidencija lokacija odbačenog otpada za 2025. https://isgo-portal.haop.hr/sites/default/files/izvjesca/2026-06/2025_ELOO_FV.pdf
2. TrashOut, opis aplikacije na App Storeu. https://apps.apple.com/app/id501471692
