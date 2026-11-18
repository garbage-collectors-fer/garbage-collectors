
U ovoj mapi nalaze se stranica za prijavu i stranice za građanina, eko-udrugu i komunalnog redara. Glavna aplikacija bira koju će stranicu prikazati prema ulozi prijavljenog korisnika.

Stranica `EkoUdruga.jsx` sada sadrži novi prikaz s karticama „Moje akcije”, „Dostupna odlagališta” i „Završene akcije”. Odabirom stavke prikazuju se njezini detalji, a kod akcija i broj volontera. Dodane su SVG ikonice i uređene boje, pozadina i raspored sadržaja u datoteci `EkoUdruga.css`. Stranica se otvara kroz postojeću prijavu za ulogu udruge.

Dostupna odlagališta dohvaćaju se s backenda, a akcije još koriste probne podatke. Rade prebacivanje kartica i odabir stavki. Gumbi za stvaranje, uređivanje i odgodu akcija te ostale radnje zasad služe samo za prikaz izgleda.

U detaljima dostupnog odlagališta sada se prikazuje fotografija iz prijave te datum i vrijeme prijave u hrvatskom formatu. Fotografija se prikazuje cijela, bez izrezivanja, a pri odabiru drugog odlagališta prikazuju se njegovi podaci. Ako fotografija nedostaje ili se ne može učitati, prikazuje se poruka „Fotografija nije dostupna.”. Za datum koji nedostaje ili nije ispravan prikazuje se „Datum nije dostupan.”.

U kartici „Dostupna odlagališta” dodani su polje za pretragu po adresi ili broju prijave i izbornik kategorije otpada. Pretraga ne razlikuje velika i mala slova i može se koristiti zajedno s odabirom kategorije. Popis, detalji i oznake na karti prate odabrane uvjete. Ispod filtera piše koliko je odlagališta prikazano od ukupnog broja dostupnih. Ako nema rezultata, prikazuje se kratka poruka, a gumb „Očisti filtre” briše pretragu i vraća sve kategorije.
