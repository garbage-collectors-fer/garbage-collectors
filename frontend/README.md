Frontend je napravljen u Reactu koristeći Vite. Aplikacija ima Google prijavu, a nakon prijave prikazuje stranicu prema dodijeljenoj ulozi korisnika: građanin, eko-udruga ili komunalni redar. Za rad Google prijave potrebno je pokrenuti backend i postaviti Google OAuth podatke.

Za pokretanje frontenda u mapi `frontend` treba pokrenuti `npm install`, a zatim `npm run dev`. Naredba `npm run build` priprema aplikaciju za objavu.

Novi prikaz eko-udruge uključen je u glavnu aplikaciju i prikazuje se korisniku s ulogom udruge nakon prijave. Sadrži kartice akcija i dostupnih odlagališta, detalje, broj volontera i SVG ikonice. Dostupna odlagališta dohvaćaju se s backenda, dok akcije još koriste probne podatke, a gumbi za izmjene nisu implementirani.

U detalje dostupnog odlagališta dodani su fotografija otpada te datum i vrijeme prijave. Ako fotografija ili datum nisu dostupni, prikazuje se kratka poruka.

Na stranici eko-udruge dodani su pretraživanje odlagališta po adresi ili broju prijave i filtriranje po kategoriji otpada. Pretraga i filter mogu se koristiti zajedno. Prikazuje se broj pronađenih odlagališta, a gumb „Očisti filtre” vraća cijeli popis.

Dodano je sortiranje odlagališta po datumu prijave. Može se odabrati „Najnovije prvo” ili „Najstarije prvo”, a na početku se prikazuju najnovije prijave. Sortiranje radi zajedno s pretragom i filterom, a datum prijave vidi se i na popisu odlagališta.

Fotografija odlagališta sada se klikom može otvoriti preko cijele stranice kako bi se lakše pregledala. Prikazuje se cijela, bez izrezivanja, a zatvara se gumbom „Zatvori”, tipkom Escape ili klikom izvan fotografije.

Stranica eko-udruge prilagođena je mobitelima. Kartice i filtri na manjim ekranima prikazuju se jedan ispod drugoga, a gumbi su širi kako bi ih bilo lakše pritisnuti. Prilagođene su veličine fotografije i karte, a duže adrese prelamaju se u više redaka.

Na stranici eko-udruge dodane su jasnije poruke tijekom učitavanja odlagališta, kod greške i kada je popis prazan. Ako učitavanje ne uspije, gumb „Pokušaj ponovno” ponovno dohvaća podatke bez osvježavanja cijele stranice. Kada nema dostupnih odlagališta, može se odabrati „Osvježi popis”, a ako pretraga nema rezultata, prikazuje se poruka s gumbom „Očisti filtre”.

Zaseban lokalni demo bez Google prijave nije dio repozitorija i nije dostupan samim preuzimanjem projekta.
