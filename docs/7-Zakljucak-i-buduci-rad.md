# 7. Zaključak i budući rad

**Cilj:** Objektivno procijeniti i dokumentirati konačni opseg onoga što je tim isporučio, kritički se osvrnuti na najvažnije inženjerske spoznaje stečene tijekom razvoja programa te identificirati realne mogućnosti nadogradnje.

## 7.1 Rezultati projekta

EcoSentry je web aplikacija dostupna na https://ecosentry-6rg1.onrender.com. Prvi ciklus ostvario je osnovni tok prijave otpada, a integracije i akcije čišćenja ostavljene su za drugi ciklus.

**Dovršeno i ispitano:**
- Prijava i odjava Google računom (OAuth 2.0 / OpenID Connect); uloga korisnika (građanin, eko-udruga, komunalni redar) čita se iz baze, a novi korisnik postaje građanin.
- Građanin podnosi prijavu otpada s lokacijom (GPS ili odabir na karti), fotografijom i kategorijom te vidi popis svojih prijava sa statusom. Sučelje građanina prilagođeno je mobitelu.
- Karta s Google Maps pribadačama obojanim prema statusu prijave.
- Komunalni redar vidi prijave, prihvaća ih ili odbacuje, mijenja kategoriju te ih šalje eko-udrugama ili na službenu sanaciju.
- Eko-udruga vidi prijave koje joj je redar poslao (karta, popis, pretraživanje, filtriranje i sortiranje, fotografija preko cijelog zaslona).
- Poslužitelj provjerava ulogu za svaku radnju, a fotografije se spremaju na Cloudinary.
- Aplikacija je javno postavljena na Renderu, a baza je PostgreSQL na Neonu sa shemom pod kontrolom Flyway migracija.
- Ispitivanje: 44 automatska testa (komponentna razina) i ručni sustavski slučajevi ST-01 do ST-11 opisani u [5. Ispitivanje](5-Ispitivanje.md).

**Djelomično ostvareno:**
- Blokiranje korisnika: poslužitelj odbija prijavu blokiranog korisnika, ali nema sučelja za blokiranje i uklanjanje blokade.
- Dodavanje redara i odobravanje udruga: uloge se zasad postavljaju migracijama u bazi, a ne u sučelju.

**Nije ostvareno u prvom ciklusu:**
- Integracije s Google Calendar i OpenWeatherMap (od tri obavezne integracije ostvarena je Google Maps uz prijavu Googleom).
- Akcije čišćenja, prijava volontera i kalendar akcija.
- Zatvaranje prijava s fotografijom očišćene lokacije, obavijesti u aplikaciji i statistika.
- Dohvaćanje adrese iz koordinata.

## 7.2 Izazovi i naučene lekcije

**Izravna izmjena glavne grane.** Izmjena poslana izravno na `master` uvela je popis dopuštenih e-mail adresa pa se većina članova nije mogla prijaviti na javnoj adresi. Tim je popis dopunio članovima, a zatim ga zamijenio tablicom korisnika u bazi. Lekcija: izmjene prijave i uloga idu kroz pull request i pregled drugog člana, jer greška odmah zahvaća sve.

**Uspješna izgradnja nije isto što i ispravna aplikacija.** Izgradnja na Renderu padala je od 15. 11. jer su testovi dodani bez test ovisnosti, a nakon prelaska na Cloudinary jedan se test više nije mogao prevesti. Javna inačica pritom je ostala na starijoj izgradnji bez ikakve vidljive pogreške. Tim je dodao ovisnosti, izbacio prevođenje testova iz Docker izgradnje i prilagodio test. Lekcija: bez kontinuirane integracije (`ci.yml` samo ispisuje poruku) takve se greške otkrivaju tek kad netko pogleda zapise postavljanja, pa treba automatski graditi i testirati svaki pull request.

**Konfiguracija bez zadanih vrijednosti.** Nakon spajanja baze na Neon aplikacija se nije pokretala dok varijable `DB_HOST`, `DB_USER` i `DB_PASSWORD` nisu bile postavljene na Renderu, a isto se ponovilo i s Cloudinaryjem. Lekcija: nove varijable okruženja postavljaju se na Renderu prije spajanja promjene koja ih traži i navode se u dokumentu 6.

**Privremena pohrana slika.** Fotografije spremljene na disk Rendera nestajale su pri svakom novom postavljanju, pa su prijave ostajale bez slike. Rješenje je vanjska pohrana (Cloudinary). Lekcija: za podatke koje korisnik unosi treba od početka odabrati trajnu pohranu.

## 7.3 Budući rad

Prioriteti za drugi ciklus, po važnosti:
1. **Google Calendar i OpenWeatherMap:** obavezne integracije teme. Calendar traži dodatno dopuštenje (`calendar.events`) pri prijavi, a prognoza se prikazuje uz akciju čišćenja.
2. **Akcije čišćenja i volonteri:** udruga kreira akciju iz jedne ili više prijava, građani se prijavljuju kao volonteri, a prijava prelazi u status akcije u tijeku.
3. **Zatvaranje prijava i obavijesti:** fotografija očišćene lokacije, potvrda redara i obavijest građaninu u aplikaciji.
4. **Upravljanje korisnicima u sučelju:** dodavanje redara, odobravanje udruga i blokiranje.
5. **Kontinuirana integracija:** automatska izgradnja i testovi na svakom pull requestu, uz ispitivanje cjelovitog toka (prijava, prijava otpada, odluka redara).
6. **Adresa iz koordinata** (geokodiranje) i statistika prijava za redara.

---

>**Završna provjera:** Tvrdnje o dovršenim funkcionalnostima podudaraju se s postavljenom aplikacijom i rezultatima ispitivanja. Nedovršen rad jasno je naveden; planovi za budući rad ne prikazuju se kao dovršene funkcionalnosti. Utrošeno vrijeme i pojedinačni doprinosi dokumentirani su u dokumentu [A. Pregled aktivnosti grupe](A-Pregled-aktivnosti-grupe.md).
