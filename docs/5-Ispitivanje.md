# 5. Ispitivanje

**Cilj:** Prikazati kako tim provjerava važno ponašanje aplikacije, što je stvarno ispitano, što rezultati pokazuju i koji poznati nedostaci ostaju. Planirano ispitivanje nije dokaz uspješnog izvođenja.

Povezivanje zahtjev → obrazac uporabe → ispitivanje održava se u [tablici sljedivosti zahtjeva](2-Analiza-zahtjeva.md); specifikacije ispitivanja i dokazi izvođenja bilježe se ovdje ili se povezuju s ispitivanjima u repozitoriju.

## 5.1 Pristup ispitivanju

**Cilj:** Odabrati provjere koje obuhvaćaju glavne korisničke ciljeve, važne uvjete neuspjeha i projektno specifične nefunkcijske zahtjeve.

**Pokretanje testova na Windowsu (CMD), iz mape `backend/`:**

```cmd
mvnw.cmd clean test
```

U PowerShellu, iz iste mape:

```powershell
.\mvnw.cmd clean test
```

Na Linuxu/macOS-u:

```bash
./mvnw clean test
```

**Pristup ispitivanju:** Poslužiteljski dio (Java 21, Spring Boot) ispituje se automatiziranim testovima JUnit 5, uz Mockito za izoliranje ovisnosti. Testovi obuhvaćaju servisna pravila prijava i slika (`PrijavaServiceTest`, `SlikaServiceTest`), delegiranje HTTP kontrolera (`PrijavaControllerTest`), deklarirane uvjete autorizacije na metodama kontrolera (`AutorizacijaTest`) te upite repozitorija za kategorije, korisnike i prijave (`KategorijaRepositoryTest`, `KorisnikRepositoryTest`, `PrijavaRepositoryTest`). Servisni i kontrolerski testovi koriste lažne objekte; repozitorijski testovi koriste testni JPA kontekst i H2, bez zajedničke Neon baze. Testovi se pokreću iz mape `backend/`. Na Linuxu/macOS-u koristi se `./mvnw clean test`, a u Windows CMD-u `mvnw.cmd clean test` (u PowerShellu `.\mvnw.cmd clean test`; vidi zasebnu naredbu ispod).

Stvarni HTTP odgovori Spring Securityja (401 bez prijave i 403 za nedopuštenu ulogu), Google OAuth prijava, prikaz stranica po ulogama, GPS/karta, učitavanje slike kroz preglednik te spremanje u zajedničku Neon bazu zahtijevaju provjeru pokrenute aplikacije. U repozitoriju postoje testovi anotacija `@PreAuthorize` i testovi delegiranja kontrolera, ali oni **nisu** MockMvc/integracijski testovi koji dokazuju stvarne HTTP statuse ili cjelovit tijek autentikacije. Te provjere, kao i javno okruženje, zato se vode odvojeno kao ručni sustavski testovi. Dokazi ručnih izvođenja (snimke zaslona, ispisi naredbi) čuvaju se u `tests/evidence/`. Prije ručnog ispitivanja koristiti testne račune i probne podatke; ne brisati niti mijenjati tuđe zapise u zajedničkoj bazi. Ako funkcionalnost nije implementirana ili nije dostupna u testnom okruženju, slučaj označiti kao **Blokiran/Nije implementirano**, a ne kao prošao.

Kontinuirana integracija trenutačno **nije** u uporabi: `.github/workflows/ci.yml` ispisuje samo poruku i ne izvodi izgradnju ni testove. Uspješno lokalno pokretanje testova stoga nije isto što i automatska provjera pri svakom pull requestu ili pushu.

## 5.2 Ispitni slučajevi

**Cilj:** Važne provjere učiniti ponovljivima bilježenjem scenarija, ulaza, koraka, očekivanog rezultata i rezultata izvođenja. Svakoj provjeri dodijeljen je stabilan ID koji se može koristiti u tablici sljedivosti zahtjeva.

Oznake: **CT** – komponenta (automatizirano, Java), **ST** – sustav (ručno u pokrenutoj aplikaciji). U zagradi uz scenarij navedeni su zahtjevi iz [dokumenta 2](2-Analiza-zahtjeva.md) i obrasci uporabe. Automatizirani slučajevi CT-01 do CT-38 i ručni sustavski slučajevi ST-01 do ST-11 označeni su prema izvještaju autora izvođenja kao prošli. Izvornici izvođenja (ispis testova, snimke zaslona) čuvaju se u `tests/evidence/`, a podaci izvođenja navedeni su u odjeljku 5.3.

### Komponente: prijave otpada (automatizirani testovi napisani)

U stupcu „Koraci ispitivanja“ naveden je naziv testne metode; ako nije naveden razred, metoda je u `PrijavaServiceTest`.

| ID ispitnog slučaja | Scenarij ispitivanja | Ulazni podaci | Očekivani rezultat | Stvarni rezultat | Ishod | Koraci ispitivanja |
| --- | --- | --- | --- | --- | --- | --- |
| CT-01 | Valjana prijava otpada (F-005, UC-002) | Građanin; slika; lat 45.8150, lng 15.9819; postojeća kategorija | Prijava ima status `PRIJAVLJENO`, `provjerena` = false, URL slike i prijavitelja; sprema se jednom. | Prošlo prema izvještaju izvođenja koji je dostavio autor. | Prošao | Test `PrijavaServiceTest.stvori_valjanaPrijava_spremaSePrijavaSaStatusomPrijavljeno`; `./mvnw clean test`. |
| CT-02 | Lokacija izvan granica (F-005) | lat 90.5 ili -90.5; lng 180.5 ili -180.5 | Status 400; slika i prijava se ne spremaju. | Prošlo prema izvještaju izvođenja koji je dostavio autor. | Prošao | Test `stvori_lokacijaIzvanGranica_vracaBadRequestINistaSeNeSprema` (četiri para vrijednosti). |
| CT-03 | Prijava bez kategorije (F-005) | kategorija nije zadana | Status 400; prijava se ne sprema. | Prošlo prema izvještaju izvođenja koji je dostavio autor. | Prošao | Test `stvori_bezKategorije_vracaBadRequest`. |
| CT-04 | Nepostojeća kategorija (F-005) | kategorija s ID-om 99 koji ne postoji | Status 400; slika se ne sprema (nema zaostalih datoteka). | Prošlo prema izvještaju izvođenja koji je dostavio autor. | Prošao | Test `stvori_nepostojecaKategorija_vracaBadRequestINeSpremaSliku`. |
| CT-05 | Blokiran korisnik (F-004) | Korisnik blokiran uz razlog | Status 403; prijava se ne sprema. | Prošlo prema izvještaju izvođenja koji je dostavio autor. | Prošao | Test `stvori_blokiranKorisnik_vracaForbidden`. |
| CT-06 | Nepoznat korisnik | E-mail koji nije u bazi | Status 401; prijava se ne sprema. | Prošlo prema izvještaju izvođenja koji je dostavio autor. | Prošao | Test `stvori_nepoznatKorisnik_vracaUnauthorized`. |
| CT-07 | Izmjena bez podataka (F-015) | prazan zahtjev za izmjenu | Status 400. | Prošlo prema izvještaju izvođenja koji je dostavio autor. | Prošao | Test `izmijeni_bezPodataka_vracaBadRequest`. |
| CT-08 | Prihvaćanje prijave (F-015, UC-004) | prijava `PRIJAVLJENO`; `provjerena: true` | `provjerena` = true, status ostaje `PRIJAVLJENO`. | Prošlo prema izvještaju izvođenja koji je dostavio autor. | Prošao | Test `izmijeni_prihvacanje_postavljaProvjerenaIStatusOstajePrijavljeno`. |
| CT-09 | Odbacivanje prijave (F-015, UC-004) | prijava `PRIJAVLJENO`; `status: ODBACENO` | Status `ODBACENO`, `provjerena` = true. | Prošlo prema izvještaju izvođenja koji je dostavio autor. | Prošao | Test `izmijeni_odbacivanje_postavljaStatusOdbacenoIProvjerena`. |
| CT-10 | Već odbačena prijava (F-015) | prijava `ODBACENO`; prihvaćanje, zatim odbacivanje | U oba slučaja status 409. | Prošlo prema izvještaju izvođenja koji je dostavio autor. | Prošao | Test `izmijeni_vecOdbacenaPrijava_prihvacanjeIOdbacivanjeVracajuConflict`. |
| CT-11 | Nepostojeća prijava (F-015) | ID 404 koji ne postoji | Status 404. | Prošlo prema izvještaju izvođenja koji je dostavio autor. | Prošao | Test `izmijeni_nepostojecaPrijava_vracaNotFound`. |
| CT-12 | Slanje eko-udrugama prije prihvaćanja (F-017) | prijava nije provjerena; `nacinSanacije: UDRUGA` | Status 409. | Prošlo prema izvještaju izvođenja koji je dostavio autor. | Prošao | Test `izmijeni_slanjeUdrugamaPrijeNegoJePrihvacena_vracaConflict`. |
| CT-13 | Slanje eko-udrugama nakon prihvaćanja (F-017, UC-004) | prihvaćena prijava; `nacinSanacije: UDRUGA` | `nacinSanacije` = `UDRUGA`, status ostaje `PRIJAVLJENO`. | Prošlo prema izvještaju izvođenja koji je dostavio autor. | Prošao | Test `izmijeni_slanjeUdrugamaNakonPrihvacanja_postavljaNacinSanacije`. |
| CT-14 | Promjena kategorije (F-016) | aktivna prijava; zatim odbačena prijava; nova kategorija | Aktivnoj se kategorija mijenja; odbačenoj status 409. | Prošlo prema izvještaju izvođenja koji je dostavio autor. | Prošao | Test `izmijeni_promjenaKategorije_mijenjaKategorijuAliNeOdbacenojPrijavi`. |
| CT-15 | Vidljivost prijavitelja (F-010, UC-003) | dvije prijave dvaju građana; pregled kao jedan građanin i kao redar | Građanin vidi prijavitelja samo svoje prijave; redar vidi sve prijavitelje. | Prošlo prema izvještaju izvođenja koji je dostavio autor. | Prošao | Test `dohvatiVidljive_gradaninVidiPrijaviteljaSamoSvojihPrijava_redarSvih`. |
| CT-16 | Eko-udruga vidi samo svoje prijave (F-017) | prijava poslana udrugama i prijava bez odluke; pregled kao udruga | Udruga vidi samo prijavu poslanu udrugama. | Prošlo prema izvještaju izvođenja koji je dostavio autor. | Prošao | Test `dohvatiVidljive_udrugaVidiSamoPrijavePoslaneUdrugama`. |
| CT-17 | Filtri popisa (F-010, F-015) | tri prijave; filter `provjerena=false`; filter `status=AKCIJA_U_TIJEKU` | Svaki filtar vraća samo odgovarajuće prijave. | Prošlo prema izvještaju izvođenja koji je dostavio autor. | Prošao | Test `dohvatiVidljive_filtriStatusIProvjerenaSuzavajuPopis`. |
| CT-18 | Odbačene i službene prijave nisu na popisu (F-010) | pregled popisa prijava | Upit isključuje statuse `ODBACENO` i `SLUZBENA_SANACIJA`. | Prošlo prema izvještaju izvođenja koji je dostavio autor. | Prošao | Test `dohvatiVidljive_upitIskljucujeOdbaceneISluzbeneSanacije`. |
| CT-19 | Tuđa odbačena prijava (F-011) | odbačena prijava drugog građanina | Status 404 („kao da ne postoji“). | Prošlo prema izvještaju izvođenja koji je dostavio autor. | Prošao | Test `dohvati_tudjaOdbacenaPrijava_vracaNotFound`. |
| CT-20 | Vlastita i redarova odbačena prijava (F-011) | odbačena prijava; pregled kao prijavitelj i kao redar | Oboje je mogu dohvatiti. | Prošlo prema izvještaju izvođenja koji je dostavio autor. | Prošao | Test `dohvati_vlastitaOdbacenaPrijavaIRedarVidiOdbacenu`. |
| CT-21 | Udruga ne vidi prijavu bez odluke (F-017) | prijava bez `nacinSanacije`; pregled kao udruga | Status 404. | Prošlo prema izvještaju izvođenja koji je dostavio autor. | Prošao | Test `dohvati_udrugaNeVidiPrijavuKojaNijePoslanaUdrugama`. |

### Komponente: slike prijava (automatizirani testovi napisani)

| ID ispitnog slučaja | Scenarij ispitivanja | Ulazni podaci | Očekivani rezultat | Stvarni rezultat | Ishod | Koraci ispitivanja |
| --- | --- | --- | --- | --- | --- | --- |
| CT-22 | Valjana slika (F-007) | PNG datoteka | Datoteka se sprema pod slučajnim imenom, vraća se URL koji završava na `.png`, sadržaj je jednak. | Prošlo prema izvještaju izvođenja koji je dostavio autor. | Prošao | Test `SlikaServiceTest.spremi_valjanaSlika_spremaDatotekuIVracaUrl`. |
| CT-23 | Nedostaje ili prazna slika (F-005) | nema datoteke; datoteka veličine 0 | U oba slučaja status 400. | Prošlo prema izvještaju izvođenja koji je dostavio autor. | Prošao | Test `spremi_nedostajucaIliPrazna_vracaBadRequest`. |
| CT-24 | Datoteka koja nije slika (NF-04) | PDF | Status 400; ništa se ne sprema na disk. | Prošlo prema izvještaju izvođenja koji je dostavio autor. | Prošao | Test `spremi_datotekaKojaNijeSlika_vracaBadRequestINistaSeNeSprema`. |

### Kontroler, autorizacija i repozitoriji (automatizirani testovi napisani)

Ovi testovi postoje u ZIP-om dostavljenom repozitoriju. Važno: `AutorizacijaTest` provjerava prisutnost i vrijednosti anotacija na metodama kontrolera, a ne stvarnu Spring Security HTTP obradu. `PrijavaControllerTest` provjerava prosljeđivanje argumenata servisu uz Mockito; repozitorijski testovi koriste `@DataJpaTest` i H2.

| ID ispitnog slučaja | Scenarij ispitivanja | Ulazni podaci | Očekivani rezultat | Stvarni rezultat | Ishod | Koraci ispitivanja |
| --- | --- | --- | --- | --- | --- | --- |
| CT-25 | Autorizacija stvaranja prijave | Metoda `stvori` u `PrijavaController` | Metoda ima `@PostMapping` i `@PreAuthorize("hasRole('GRADANIN')")`. | Prošlo prema izvještaju izvođenja koji je dostavio autor. | Prošao | `AutorizacijaTest.stvaranjePrijaveZahtijevaUloguGradjanina`; `./mvnw clean test`. |
| CT-26 | Autorizacija pregleda vlastitih prijava | Metoda `dohvatiMoje` | Metoda ima `@GetMapping` i zahtijeva ulogu `GRADANIN`. | Prošlo prema izvještaju izvođenja koji je dostavio autor. | Prošao | `AutorizacijaTest.dohvacanjeMojihPrijavaZahtijevaUloguGradjanina`. |
| CT-27 | Autorizacija izmjene prijave | Metoda `izmijeni` | Metoda ima `@PatchMapping` i zahtijeva ulogu `REDAR`. | Prošlo prema izvještaju izvođenja koji je dostavio autor. | Prošao | `AutorizacijaTest.izmjenaPrijaveZahtijevaUloguRedara`. |
| CT-28 | Čitanje pojedinačne prijave | Metoda `dohvatiJednu` | Metoda nema dodatni `@PreAuthorize` uvjet. | Prošlo prema izvještaju izvođenja koji je dostavio autor. | Prošao | `AutorizacijaTest.citanjePojedinacnePrijaveNemaDodatniRoleUvjet`. |
| CT-29 | Prosljeđivanje filtara kontroleru | Status, filtar `provjerena` i korisnik | Kontroler prosljeđuje filtre i e-mail servisu. | Prošlo prema izvještaju izvođenja koji je dostavio autor. | Prošao | `PrijavaControllerTest.dohvatiSveProsljedujeFiltereIEmail`. |
| CT-30 | Prosljeđivanje podataka za stvaranje prijave | Slika, koordinate, kategorija i korisnik | Kontroler prosljeđuje sve podatke servisu. | Prošlo prema izvještaju izvođenja koji je dostavio autor. | Prošao | `PrijavaControllerTest.stvoriProsljedujeSlikuLokacijuKategorijuIEmai`. |
| CT-31 | Prosljeđivanje pojedinačnog dohvaćanja | ID prijave i korisnik | Kontroler prosljeđuje ID i e-mail servisu. | Prošlo prema izvještaju izvođenja koji je dostavio autor. | Prošao | `PrijavaControllerTest.dohvatiJednuProsljedujeIdIEmail`. |
| CT-32 | Prosljeđivanje vlastitih prijava | Korisnik | Kontroler prosljeđuje e-mail servisu i vraća rezultat. | Prošlo prema izvještaju izvođenja koji je dostavio autor. | Prošao | `PrijavaControllerTest.dohvatiMojeProsljedujeEmail`. |
| CT-33 | Prosljeđivanje izmjene prijave | ID i DTO izmjene | Kontroler prosljeđuje ID i DTO servisu. | Prošlo prema izvještaju izvođenja koji je dostavio autor. | Prošao | `PrijavaControllerTest.izmijeniProsljedujeIdIPodatke`. |
| CT-34 | Dohvat kategorije po nazivu | Postojeći i nepostojeći naziv | Vraća pronađenu kategoriju odnosno prazan `Optional`. | Prošlo prema izvještaju izvođenja koji je dostavio autor. | Prošao | `KategorijaRepositoryTest.pronalaziKategorijuPoNazivu`. |
| CT-35 | Sortirani dohvat kategorija | Kategorije unesene nesortiranim redoslijedom | Vraća kategorije abecedno po nazivu. | Prošlo prema izvještaju izvođenja koji je dostavio autor. | Prošao | `KategorijaRepositoryTest.vracaSveKategorijeSortiranePoNazivu`. |
| CT-36 | Dohvat korisnika po e-mailu | Postojeći i nepostojeći e-mail | Vraća korisnika odnosno prazan `Optional`. | Prošlo prema izvještaju izvođenja koji je dostavio autor. | Prošao | `KorisnikRepositoryTest.pronalaziKorisnikaPoEmailu` i `vracaPrazanOptionalZaNepostojeciEmail`. |
| CT-37 | Dohvat prijava određenog prijavitelja | Korisnik s jednom prijavom | Vraća prijavu pripadajućeg prijavitelja. | Prošlo prema izvještaju izvođenja koji je dostavio autor. | Prošao | `PrijavaRepositoryTest.pronalaziPrijaveOdredenogPrijavitelja`. |
| CT-38 | Isključivanje određenih statusa iz upita | Prijave `PRIJAVLJENO` i `ODBACENO` | Upit `findByStatusNotIn...` izostavlja zadane statuse. | Prošlo prema izvještaju izvođenja koji je dostavio autor. | Prošao | `PrijavaRepositoryTest.upitZaStatusNotInIzostavljaZadaneStatuse`. |

### Sustav: ručno u pokrenutoj aplikaciji

| ID ispitnog slučaja | Scenarij ispitivanja | Ulazni podaci | Očekivani rezultat | Stvarni rezultat | Ishod | Koraci ispitivanja |
| --- | --- | --- | --- | --- | --- | --- |
| ST-01 | Prijava Google računom, građanin (F-001, UC-001) | Google račun s ulogom građanina | Nakon prijave prikazuje se stranica građanina i ime korisnika u zaglavlju. | Prošlo prema izvještaju ručnog izvođenja koji je dostavio autor. | Prošao | Otvoriti aplikaciju; kliknuti prijavu Googleom; odabrati račun; provjeriti stranicu i ime. |
| ST-02 | Prvi put prijavljen račun postaje građanin (F-001) | Google račun koji još nije u bazi | Korisnik se prijavljuje kao građanin i od tada postoji u tablici `korisnik`. | Prošlo prema izvještaju ručnog izvođenja koji je dostavio autor. | Prošao | Prijaviti se novim računom; provjeriti stranicu; provjeriti redak u bazi. |
| ST-03 | Odustajanje od prijave (F-001) | Zatvaranje ili odbijanje na Googleovu zaslonu | Korisnik ostaje bez prijave i vidi stranicu za prijavu. | Prošlo prema izvještaju ručnog izvođenja koji je dostavio autor. | Prošao | Započeti prijavu; odustati na Googleu; provjeriti stanje aplikacije. |
| ST-04 | Stranice prema ulozi (F-001) | Računi kojima je u bazi postavljena uloga udruge i redara | Udruga vidi stranicu eko-udruge, a redar stranicu komunalnog redara. | Prošlo prema izvještaju ručnog izvođenja koji je dostavio autor. | Prošao | Koristiti zajedničke testne račune redara i udruge kojima su uloge unaprijed postavljene migracijom (dokument 6, odjeljak 6.2); prijaviti se; provjeriti stranicu. |
| ST-05 | Odjava | Prijavljeni korisnik, klik na „Odjava“ | Korisnik se odjavljuje i ponovno vidi stranicu za prijavu; `GET /api/me` vraća 401. | Prošlo prema izvještaju ručnog izvođenja koji je dostavio autor. | Prošao | Kliknuti odjavu; provjeriti stranicu i odgovor `/api/me`. |
| ST-06 | Podnošenje prijave otpada i pribadača na karti (F-005, F-010, UC-002, UC-003) | Slika, lokacija odabrana na karti, kategorija; kao građanin | Prikazuje se potvrda; na karti se odmah pojavljuje crvena pribadača; prijava je u popisu „Moje prijave“ i ostaje nakon osvježavanja stranice. | Prošlo prema izvještaju ručnog izvođenja koji je dostavio autor. | Prošao | Otvoriti obrazac; unijeti podatke; poslati; provjeriti potvrdu, kartu i popis; osvježiti stranicu i ponoviti provjeru. |
| ST-07 | Prijava bez slike ili s krivom datotekom (F-005, NF-04) | prijava bez slike; PDF umjesto slike; slika veća od 10 MB | Korisnik vidi poruku što je pogrešno; broj prijava se ne povećava. | Prošlo prema izvještaju ručnog izvođenja koji je dostavio autor. | Prošao | Poslati svaku varijantu; provjeriti poruku; usporediti popis prijava prije i poslije. |
| ST-08 | Redar prihvaća i odbacuje prijavu (F-015, UC-004) | Prijava `PRIJAVLJENO`; kao redar | Prihvaćena ostaje na karti; odbačena nestaje s karte. | Prošlo prema izvještaju ručnog izvođenja koji je dostavio autor. | Prošao | Prijaviti se kao redar; prihvatiti jednu, odbaciti drugu prijavu; provjeriti kartu. |
| ST-09 | Redar šalje prijavu eko-udrugama i na službenu sanaciju (F-017, UC-004, UC-008) | Prihvaćena prijava; kao redar | Poslana udrugama vidi se udruzi; poslana na službenu sanaciju nestaje s karte i iz popisa. | Prošlo prema izvještaju ručnog izvođenja koji je dostavio autor. | Prošao | Prihvatiti prijavu; poslati udrugama; zatim drugu poslati na službenu sanaciju; provjeriti kartu i stranicu udruge. Slanje na službenu sanaciju samo mijenja status prijave i ne zahtijeva broj naloga (odluka tima, zahtjev AS-05). |
| ST-10 | Responzivnost (NF-01) | Širina zaslona 360 px (Chrome DevTools) | Radnje građanina izvedive su bez vodoravnog pomicanja stranice. | Prošlo prema izvještaju ručnog izvođenja koji je dostavio autor. | Prošao | Uključiti prikaz za mobitel 360 px; proći kroz radnje građanina; zabilježiti poteškoće. |
| ST-11 | HTTPS na javnoj adresi (NF-03) | Javna adresa s Rendera | Aplikacija se otvara preko `https://` i prijava preko Googlea radi. | Prošlo prema izvještaju ručnog izvođenja koji je dostavio autor. | Prošao | Otvoriti javnu adresu; provjeriti protokol u adresnoj traci; izvesti ST-01 i ST-06 na toj adresi. |

## 5.3 Provedena ispitivanja i rezultati

**Cilj:** Navesti reviziju aplikacije, okruženje i dokaze potrebne za tumačenje stvarnih rezultata u tablici ispitnih slučajeva.

**Najnovije izvođenje ili dokaz:** Automatizirane testove (CT-01 do CT-38) i ručne sustavske slučajeve (ST-01 do ST-11) izveo je autor ispitivanja, koji izvještava da su svi prošli. Podaci izvođenja:

| Podatak | Vrijednost |
| --- | --- |
| Datum izvođenja | 15. 11. 2026. |
| Revizija aplikacije (`git rev-parse --short HEAD`) | 66cb6b5 |
| Izvođač | Bruno Hrgovan |
| Okruženje automatiziranih testova | lokalno, `./mvnw clean test` (JUnit 5, Mockito, H2 za repozitorijske testove) |
| Okruženje ručnih slučajeva | ST-01 do ST-10 lokalno (backend na `localhost:8080`, frontend na `localhost:5173`); ST-11 na javnoj adresi `https://ecosentry-6rg1.onrender.com` |
| Sažetak naredbe `./mvnw clean test` | `Tests run: 42, Failures: 0, Errors: 0, Skipped: 0` |
| Dokazi | ispis izvođenja testova i snimke zaslona u [`tests/evidence/`](../tests/evidence/) |

U repozitoriju je 7 testnih razreda: servisni (`PrijavaServiceTest`, `SlikaServiceTest`), kontrolerski (`PrijavaControllerTest`), autorizacijski (`AutorizacijaTest`) i repozitorijski (`KategorijaRepositoryTest`, `KorisnikRepositoryTest`, `PrijavaRepositoryTest`). Ukupno je 39 JUnit testnih metoda (38 običnih i jedna parametrizirana); parametrizirani test provjerava četiri para koordinata, pa se očekuje 42 pojedinačna izvođenja. Stvarni broj uspješnih izvođenja prepisuje se iz ispisa pokretanja.

Rezultati se odnose samo na funkcionalnosti koje su implementirane. Ručne provjere ne dokazuju ponašanje onoga što još ne postoji (akcije čišćenja, obavijesti, zatvaranje prijava, statistika); to je navedeno u odjeljku 5.4. Uspjeh jediničnih testova nije dokaz da su Google prijava, javna adresa, karta i trajna pohrana ispravni; njih pokrivaju ručni slučajevi ST-01 do ST-11.

Stupci **Stvarni rezultat** i **Ishod** u odjeljku 5.2 mjerodavni su rezultati za pojedinačni slučaj. Neuspješna i blokirana izvođenja bilježe se iskreno; pri ponovnom izvođenju zadržava se relevantna povijest umjesto prikaza starog uspješnog rezultata kao trenutačnog.

## 5.4 Poznati nedostaci i ograničenja ispitivanja

**Cilj:** Omogućiti čitatelju da vidi nedostatke koji utječu na uporabu trenutačne aplikacije i važno ponašanje koje tim nije mogao provjeriti.

| Problem ili ograničenje | Korisniku vidljiv učinak ili neprovjereno ponašanje | Dokaz ili poveznica na zadatak |
| --- | --- | --- |
| Slike prijava spremaju se na disk web-usluge | Na Renderu disk nije trajan: nakon novog postavljanja ili ponovnog pokretanja slike nestaju, a prijave ostaju bez slike. | `application.properties` (`app.upload-dir`); `SlikaService`, `WebConfig` |
| Obavijesti nisu implementirane (F-009) | Prijavitelj ne dobiva obavijest kad se prijava odbaci ili riješi. | Bilješka `TODO` u `PrijavaService.izmijeni`; u `backend/src` nema kontrolera obavijesti |
| Nisu implementirani akcije čišćenja, zatvaranje prijave, zahtjevi udruga, blokiranje korisnika i statistika | Nedovršen obavezan opseg (npr. F-020, F-024, F-025, F-003): udruga ne može kreirati akcije, volonteri se ne mogu prijaviti, prijava se ne može zatvoriti kao očišćena. | `backend/src/.../controller` sadrži samo kontrolere za prijave, kategorije i korisnika |
| Redari i udruge dodjeljuju se u bazi, ne u aplikaciji | Svaki novi korisnik postaje građanin. Uloge redara i udruge članova tima postavljene su migracijama (V2 do V4), a za ostale račune SQL naredbom. Redar ne može u aplikaciji dodati drugog redara (F-002), a udruga ne može poslati zahtjev za račun (F-003). | `CustomOidcUserService`; `db/migration/V2` do `V4`; dokument 6, odjeljak 6.2 |
| Stranica eko-udruge koristi probne podatke za akcije | Popis akcija na stranici udruge je ugrađen u kod; gumbi „Nova akcija“ i „Organiziraj akciju“ nisu aktivni. Udruga vidi samo prijave koje joj je redar poslao. | `frontend/src/pages/EkoUdruga.jsx` |
| Poslužitelj prihvaća i WebP slike | NF-04 navodi samo JPG i PNG. Sučelje dopušta samo JPG i PNG, ali izravan zahtjev API-ju s WebP slikom poslužitelj prihvaća. | `SlikaService` (`DOPUSTENI_TIPOVI`); `Gradjanin.jsx` |
| Automatizirani testovi ne pokrivaju cjeloviti HTTP/sustavski tijek | Postoje servisni, kontrolerski, autorizacijski (provjera anotacija) i repozitorijski testovi. Nedostaju integracijski testovi koji provjeravaju stvarne HTTP statuse kroz Spring Security, Google OAuth, preglednik i javno postavljanje; CI ne pokreće testove. | `backend/src/test/java/...`; `.github/workflows/ci.yml` (samo `echo`); odjeljak 5.2 |
| Backend se lokalno spaja na zajedničku bazu | Pri lokalnom ručnom testiranju prijave ostaju u bazi koju koristi cijeli tim. | Dokument 6, odjeljak 6.2 |
| Ručni slučajevi izvedeni su lokalno, a na javnoj adresi samo ST-11 | Ponašanje na Renderu za ostale tijekove (podnošenje prijave, slike, uloge redara i udruge, ponovna prijava nakon novog postavljanja) nije zasebno ispitano. Slike prijava na Renderu nestaju pri novom postavljanju. | Slučaj ST-11; dokument 6, odjeljak 6.3 |
