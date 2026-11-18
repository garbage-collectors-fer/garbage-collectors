
U ovoj mapi nalaze se stranica za prijavu i stranice za građanina, eko-udrugu i komunalnog redara. Glavna aplikacija bira koju će stranicu prikazati prema ulozi prijavljenog korisnika.

Stranica `EkoUdruga.jsx` sada sadrži novi prikaz s karticama „Moje akcije”, „Dostupna odlagališta” i „Završene akcije”. Odabirom stavke prikazuju se njezini detalji, a kod akcija i broj volontera. Dodane su SVG ikonice i uređene boje, pozadina i raspored sadržaja u datoteci `EkoUdruga.css`. Stranica se otvara kroz postojeću prijavu za ulogu udruge.

Dostupna odlagališta dohvaćaju se s backenda, a akcije još koriste probne podatke. Rade prebacivanje kartica i odabir stavki. Gumbi za stvaranje, uređivanje i odgodu akcija te ostale radnje zasad služe samo za prikaz izgleda.

U detaljima dostupnog odlagališta sada se prikazuje fotografija iz prijave te datum i vrijeme prijave u hrvatskom formatu. Fotografija se prikazuje cijela, bez izrezivanja, a pri odabiru drugog odlagališta prikazuju se njegovi podaci. Ako fotografija nedostaje ili se ne može učitati, prikazuje se poruka „Fotografija nije dostupna.”. Za datum koji nedostaje ili nije ispravan prikazuje se „Datum nije dostupan.”.

U kartici „Dostupna odlagališta” dodani su polje za pretragu po adresi ili broju prijave i izbornik kategorije otpada. Pretraga ne razlikuje velika i mala slova i može se koristiti zajedno s odabirom kategorije. Popis, detalji i oznake na karti prate odabrane uvjete. Ispod filtera piše koliko je odlagališta prikazano od ukupnog broja dostupnih. Ako nema rezultata, prikazuje se kratka poruka, a gumb „Očisti filtre” briše pretragu i vraća sve kategorije.

Uz pretragu i filter dodan je izbornik „Sortiraj po datumu prijave” s opcijama „Najnovije prvo” i „Najstarije prvo”. Na početku su najnovije prijave prve, a sortiranje se primjenjuje i na rezultate pretrage i filtriranja. Datum prijave sada se vidi i uz svako odlagalište na popisu. Prijave bez ispravnog datuma uvijek su na kraju, a promjena redoslijeda zadržava odabrano odlagalište.

Klikom na fotografiju ili natpis „Otvori fotografiju” otvara se veliki prikaz preko cijele stranice. Fotografija se prilagođava ekranu i prikazuje bez izrezivanja, uz broj prijave i gumb „Zatvori”. Prikaz se može zatvoriti i tipkom Escape ili klikom izvan fotografije. Dok je fotografija otvorena, stranica u pozadini se ne može pomicati, a nakon zatvaranja ostaju prikazani detalji istog odlagališta.
