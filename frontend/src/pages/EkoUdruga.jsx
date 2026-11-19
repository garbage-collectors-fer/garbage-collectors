import { useEffect, useRef, useState } from 'react';
import KartaPrijava from '../components/KartaPrijava.jsx';
import { dohvatiPrijave } from '../services/prijaveServis.js';
import { nazivKategorije, formatirajDatum } from '../services/oznake.js';
import './KomunalniRedar.css';
import './EkoUdruga.css';

function Ikona({ naziv }) {
  const putanje = {
    list: 'M20 4C10 3 3 8 5 16c8 3 14-3 15-12ZM4 21l11-11',
    kalendar: 'M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14H3V6a2 2 0 0 1 2-2ZM7 14h3m4 0h3m-10 4h3',
    lokacija: 'M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0ZM15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
    potvrda: 'm7 12 3 3 7-7M21 12a9 9 0 1 1-5-8',
    plus: 'M12 5v14M5 12h14',
    sat: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM12 7v5l3 2',
    ljudi: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m20 0v-2a4 4 0 0 0-3-4M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Zm4-4a4 4 0 0 1 0 8',
    olovka: 'm15 4 5 5M4 20l5-1L21 7a2 2 0 0 0-5-5L4 14v6Z',
    slika: 'M3 3h18v18H3V3Zm0 13 6-6 5 5 3-3 4 4M16 7h.01',
    oznaka: 'M3 3h8l10 10-8 8L3 11V3Zm5 5h.01',
    trazi: 'M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z',
    povecaj: 'M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5',
    zatvori: 'm6 6 12 12M6 18 18 6',
    upozorenje: 'M12 3 2 21h20L12 3Zm0 6v5m0 3v1',
  };
  return <svg className="udruga-ikona" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d={putanje[naziv]} /></svg>;
}

function normalizirajPretragu(tekst) {
  return tekst.toLocaleLowerCase('hr').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replaceAll('đ', 'd');
}

function StanjePopisa({ ikona, naslov, opis, greska = false, radnja, tekstRadnje }) {
  return (
    <section className={'udruga-stanje' + (greska ? ' udruga-stanje-greska' : '')}>
      <span className="udruga-stanje-ikona"><Ikona naziv={ikona} /></span>
      <div role={greska ? 'alert' : 'status'}>
        <h2>{naslov}</h2>
        <p>{opis}</p>
      </div>
      {radnja && <button type="button" className="redar-gumb" onClick={radnja}>{tekstRadnje}</button>}
    </section>
  );
}

function FotografijaOdlagalista({ prijava }) {
  const [greskaSlike, setGreskaSlike] = useState(false);
  const pregled = useRef(null);
  const dostupna = prijava.slikaUrl && !greskaSlike;
  const opis = `Fotografija otpada na odlagalištu, prijava #${prijava.id}`;

  return (
    <>
    <figure className="udruga-fotografija">
      {dostupna ? (
        <button type="button" className="udruga-fotografija-otvori"
          aria-label={`Otvori fotografiju prijave #${prijava.id} preko cijelog ekrana`}
          aria-haspopup="dialog" onClick={() => pregled.current.showModal()}>
          <img src={prijava.slikaUrl} alt={opis} onError={() => setGreskaSlike(true)} />
          <span><Ikona naziv="povecaj" />Otvori fotografiju</span>
        </button>
      ) : (
        <div className="udruga-fotografija-prazna">
          <Ikona naziv="slika" />
          <span>Fotografija nije dostupna.</span>
        </div>
      )}
      <figcaption>Fotografija iz prijave odlagališta</figcaption>
    </figure>
    {dostupna && (
      <dialog ref={pregled} className="udruga-fotografija-pregled" aria-label={opis}
        onClick={(e) => { if (e.target === e.currentTarget) pregled.current.close(); }}>
        <header>
          <span>Fotografija prijave #{prijava.id}</span>
          <button type="button" autoFocus onClick={() => pregled.current.close()}>
            <Ikona naziv="zatvori" />Zatvori
          </button>
        </header>
        <img src={prijava.slikaUrl} alt={opis} onError={() => setGreskaSlike(true)} />
        <p>Za zatvaranje pritisni Escape ili klikni izvan fotografije.</p>
      </dialog>
    )}
    </>
  );
}

const akcije = [
  { id: 1, naziv: 'Čišćenje Savskog nasipa', lokacija: 'Savski nasip, Zagreb', datum: '21. 11. 2026.', vrijeme: '09:00 – 12:00', okupljanje: 'Kod pješačkog ulaza uz Savski most', volonteri: 8, kapacitet: 20, status: 'Prijave otvorene', opis: 'Zajedničko prikupljanje otpada uz nasip. Vreće i rukavice osigurava udruga.', zavrsena: false },
  { id: 2, naziv: 'Zeleni Maksimir', lokacija: 'Maksimirska cesta, Zagreb', datum: '28. 11. 2026.', vrijeme: '10:00 – 13:00', okupljanje: 'Glavni ulaz u park Maksimir', volonteri: 5, kapacitet: 15, status: 'Prijave otvorene', opis: 'Čišćenje prostora uz park i razvrstavanje prikupljenog otpada.', zavrsena: false },
  { id: 3, naziv: 'Čišćenje Bundeka', lokacija: 'Bundek, Zagreb', datum: '12. 11. 2026.', vrijeme: '09:00 – 12:00', okupljanje: 'Ulaz u park s istočne strane', volonteri: 18, kapacitet: 20, status: 'Čeka potvrdu redara', opis: 'Akcija je završena. Dokaz o očišćenoj lokaciji poslan je komunalnom redaru.', zavrsena: true },
];

export default function EkoUdruga() {
  const [prikaz, setPrikaz] = useState('AKCIJE');
  const [odabraniId, setOdabraniId] = useState(1);
  const [prijave, setPrijave] = useState([]);
  const [ucitavanje, setUcitavanje] = useState(true);
  const [greska, setGreska] = useState(null);
  const [pretraga, setPretraga] = useState('');
  const [kategorijaId, setKategorijaId] = useState('');
  const [redoslijed, setRedoslijed] = useState('NAJNOVIJE');
  const [pokusaj, setPokusaj] = useState(0);

  useEffect(() => {
    let aktivan = true;
    setUcitavanje(true);
    setGreska(null);
    dohvatiPrijave()
      .then((dohvaceno) => {
        if (!Array.isArray(dohvaceno)) throw new Error('Neispravan odgovor poslužitelja.');
        if (aktivan) setPrijave(dohvaceno);
      })
      .catch(() => {
        if (aktivan) setGreska('Provjeri internetsku vezu i pokušaj ponovno. Ako se greška ponavlja, pokušaj malo kasnije.');
      })
      .finally(() => { if (aktivan) setUcitavanje(false); });
    return () => { aktivan = false; };
  }, [pokusaj]);

  function ponoviUcitavanje() {
    setPokusaj((prethodni) => prethodni + 1);
  }

  function ocistiFiltre() {
    setPretraga('');
    setKategorijaId('');
    setOdabraniId(null);
  }

  const dostupne = prijave.filter((p) => p.provjerena && p.status === 'PRIJAVLJENO' && p.nacinSanacije === 'UDRUGA');
  const kategorije = [...new Map(dostupne.filter((p) => p.kategorija).map((p) => [String(p.kategorija.id), p.kategorija])).values()]
    .sort((a, b) => a.naziv.localeCompare(b.naziv, 'hr'));
  const upit = normalizirajPretragu(pretraga.trim());
  const filtrirane = dostupne.filter((p) => {
    const odgovaraPretrazi = normalizirajPretragu(p.adresa || '').includes(upit)
      || String(p.id).includes(upit.replace(/^#/, ''));
    return odgovaraPretrazi && (!kategorijaId || String(p.kategorija?.id) === kategorijaId);
  });
  const sortirane = [...filtrirane].sort((a, b) => {
    const datumA = a.datum ? new Date(a.datum).getTime() : NaN;
    const datumB = b.datum ? new Date(b.datum).getTime() : NaN;
    // Prijave bez ispravnog datuma uvijek idu na kraj popisa.
    if (Number.isNaN(datumA) && Number.isNaN(datumB)) return 0;
    if (Number.isNaN(datumA)) return 1;
    if (Number.isNaN(datumB)) return -1;
    return redoslijed === 'NAJSTARIJE' ? datumA - datumB : datumB - datumA;
  });
  const popis = prikaz === 'ODLAGALISTA' ? sortirane : akcije.filter((a) => a.zavrsena === (prikaz === 'ZAVRSENE'));
  const odabrano = popis.find((stavka) => stavka.id === odabraniId) || popis[0];
  const kartice = [
    { id: 'AKCIJE', naziv: 'Moje akcije', ikona: 'kalendar', broj: akcije.filter((a) => !a.zavrsena).length },
    { id: 'ODLAGALISTA', naziv: 'Dostupna odlagališta', ikona: 'lokacija', broj: ucitavanje || greska ? '—' : dostupne.length },
    { id: 'ZAVRSENE', naziv: 'Završene akcije', ikona: 'potvrda', broj: akcije.filter((a) => a.zavrsena).length },
  ];

  let stanje = null;
  if (prikaz === 'ODLAGALISTA') {
    if (ucitavanje) {
      stanje = { ikona: 'sat', naslov: 'Učitavanje odlagališta...', opis: 'Dohvaćamo dostupne prijave. Pričekaj trenutak.' };
    } else if (greska) {
      stanje = { ikona: 'upozorenje', naslov: 'Odlagališta se nisu uspjela učitati', opis: greska, greska: true, radnja: ponoviUcitavanje, tekstRadnje: 'Pokušaj ponovno' };
    } else if (dostupne.length === 0) {
      stanje = { ikona: 'lokacija', naslov: 'Trenutačno nema dostupnih odlagališta', opis: 'Ovdje će se prikazati provjerene prijave koje redar proslijedi eko-udrugama.', radnja: ponoviUcitavanje, tekstRadnje: 'Osvježi popis' };
    } else if (filtrirane.length === 0) {
      stanje = { ikona: 'trazi', naslov: 'Nema rezultata pretrage', opis: 'Nijedno odlagalište ne odgovara pretrazi i odabranoj kategoriji. Promijeni uvjete ili očisti filtre.', radnja: ocistiFiltre, tekstRadnje: 'Očisti filtre' };
    }
  } else if (popis.length === 0) {
    stanje = { ikona: 'kalendar', naslov: prikaz === 'ZAVRSENE' ? 'Još nema završenih akcija' : 'Još nema planiranih akcija', opis: 'Akcije će se prikazati ovdje kada budu dostupne.' };
  }

  return (
    <div className="redar-stranica udruga-stranica">
      <div className="udruga-naslovni-red">
        <div className="udruga-naslov-grupa">
          <span className="udruga-naslov-ikona"><Ikona naziv="list" /></span>
          <div>
          <h1 className="redar-naslov">Eko-udruga</h1>
          <p className="udruga-podnaslov">Organiziraj akcije čišćenja i prati sudjelovanje volontera.</p>
          </div>
        </div>
        <button type="button" className="redar-gumb redar-gumb-glavni" title="Funkcionalnost još nije implementirana"><Ikona naziv="plus" />Nova akcija</button>
      </div>

      <div className="redar-filteri" role="group" aria-label="Prikaz eko-udruge">
        {kartice.map((kartica) => (
          <button key={kartica.id} type="button" aria-pressed={prikaz === kartica.id} onClick={() => { setPrikaz(kartica.id); setOdabraniId(null); }}>
            <Ikona naziv={kartica.ikona} />{kartica.naziv} <span className="redar-broj">{kartica.broj}</span>
          </button>
        ))}
      </div>

      {prikaz === 'ODLAGALISTA' && !ucitavanje && !greska && dostupne.length > 0 && (
        <section className="udruga-pretraga" aria-label="Pretraživanje odlagališta">
          <div className="udruga-pretraga-polja">
            <label className="udruga-trazilica">
              <span><Ikona naziv="trazi" />Pretraži odlagališta</span>
              <input type="search" placeholder="Adresa ili broj prijave" value={pretraga}
                onChange={(e) => { setPretraga(e.target.value); setOdabraniId(null); }} />
            </label>
            <label>
              <span>Kategorija otpada</span>
              <select value={kategorijaId} disabled={ucitavanje || !!greska}
                onChange={(e) => { setKategorijaId(e.target.value); setOdabraniId(null); }}>
                <option value="">Sve kategorije</option>
                {kategorije.map((k) => <option key={k.id} value={String(k.id)}>{k.naziv}</option>)}
              </select>
            </label>
            <label>
              <span>Sortiraj po datumu prijave</span>
              <select value={redoslijed} onChange={(e) => { setOdabraniId(odabrano?.id ?? null); setRedoslijed(e.target.value); }}>
                <option value="NAJNOVIJE">Najnovije prvo</option>
                <option value="NAJSTARIJE">Najstarije prvo</option>
              </select>
            </label>
            <button type="button" className="redar-gumb" disabled={!pretraga && !kategorijaId}
              onClick={ocistiFiltre}>Očisti filtre</button>
          </div>
          {!ucitavanje && !greska && <p role="status">Prikazano odlagališta: <strong>{filtrirane.length}</strong> od {dostupne.length}</p>}
        </section>
      )}

      {stanje ? <StanjePopisa {...stanje} /> : <div className="redar-raspored">
        <section className="redar-popis" aria-label="Popis za eko-udrugu">
          {popis.map((stavka) => (
            <button key={stavka.id} type="button" aria-pressed={odabrano?.id === stavka.id} className={'redar-stavka' + (odabrano?.id === stavka.id ? ' redar-stavka-odabrana' : '')} onClick={() => setOdabraniId(stavka.id)}>
              <span className="udruga-stavka-ikona"><Ikona naziv={prikaz === 'ODLAGALISTA' ? 'lokacija' : stavka.zavrsena ? 'potvrda' : 'list'} /></span>
              <span className="redar-stavka-tekst">
                <span className="redar-stavka-naslov">{prikaz === 'ODLAGALISTA' ? nazivKategorije(stavka.kategorija) : stavka.naziv}</span>
                <span className="redar-stavka-detalj">{stavka.lokacija || stavka.adresa || `${stavka.lat.toFixed(4)}, ${stavka.lng.toFixed(4)}`}</span>
                <span className="udruga-stavka-datum"><Ikona naziv={prikaz === 'ODLAGALISTA' ? 'potvrda' : 'kalendar'} />{prikaz === 'ODLAGALISTA' ? 'Dostupno za akciju' : stavka.datum}</span>
                {prikaz === 'ODLAGALISTA' && (
                  <span className="udruga-stavka-datum"><Ikona naziv="kalendar" />
                    {stavka.datum && !Number.isNaN(new Date(stavka.datum).getTime())
                      ? <time dateTime={stavka.datum}>Prijavljeno: {formatirajDatum(stavka.datum)}</time>
                      : 'Datum nije dostupan.'}
                  </span>
                )}
              </span>
            </button>
          ))}
        </section>

        {odabrano && (
          <section className="udruga-panel" aria-label="Detalji odabrane stavke">
            {prikaz === 'ODLAGALISTA' ? (
              <>
                <span className="udruga-oznaka"><Ikona naziv="potvrda" />Provjerena prijava #{odabrano.id}</span>
                <h2>{odabrano.adresa || `Odlagalište #${odabrano.id}`}</h2>
                <p>Ovu je prijavu redar proslijedio eko-udrugama. Dostupna je za organiziranje akcije čišćenja.</p>
                <FotografijaOdlagalista key={`${odabrano.id}-${odabrano.slikaUrl}`} prijava={odabrano} />
                <dl className="redar-podaci">
                  <dt><Ikona naziv="oznaka" />Kategorija</dt><dd>{nazivKategorije(odabrano.kategorija)}</dd>
                  <dt><Ikona naziv="kalendar" />Datum prijave</dt>
                  <dd>{odabrano.datum && !Number.isNaN(new Date(odabrano.datum).getTime())
                    ? <time dateTime={odabrano.datum}>{formatirajDatum(odabrano.datum)}</time>
                    : 'Datum nije dostupan.'}</dd>
                  <dt><Ikona naziv="potvrda" />Status</dt><dd>Prijavljeno</dd>
                  <dt><Ikona naziv="lokacija" />Lokacija</dt><dd>{odabrano.lat.toFixed(4)}, {odabrano.lng.toFixed(4)}</dd>
                </dl>
                <div className="udruga-karta" aria-label="Karta dostupnih odlagališta">
                  <KartaPrijava
                    prijave={filtrirane}
                    odabranaPrijavaId={odabrano.id}
                    onOdaberi={setOdabraniId}
                  />
                  <p>Odaberi odlagalište na karti ili u popisu za prikaz detalja.</p>
                </div>
                <button type="button" className="redar-gumb redar-gumb-glavni" title="Funkcionalnost još nije implementirana"><Ikona naziv="plus" />Organiziraj akciju</button>
              </>
            ) : (
              <>
                <span className={'udruga-oznaka' + (odabrano.zavrsena ? ' udruga-oznaka-cekanje' : '')}><Ikona naziv={odabrano.zavrsena ? 'sat' : 'potvrda'} />{odabrano.status}</span>
                <h2>{odabrano.naziv}</h2>
                <p>{odabrano.opis}</p>
                <dl className="redar-podaci">
                  <dt><Ikona naziv="kalendar" />Datum</dt><dd>{odabrano.datum}</dd>
                  <dt><Ikona naziv="sat" />Vrijeme</dt><dd>{odabrano.vrijeme}</dd>
                  <dt><Ikona naziv="lokacija" />Lokacija</dt><dd>{odabrano.lokacija}</dd>
                  <dt><Ikona naziv="ljudi" />Okupljanje</dt><dd>{odabrano.okupljanje}</dd>
                </dl>
                <div className="udruga-volonteri">
                  <div><h3><Ikona naziv="ljudi" />Volonteri</h3><span><strong>{odabrano.volonteri}</strong> / {odabrano.kapacitet}</span></div>
                  <progress value={odabrano.volonteri} max={odabrano.kapacitet} aria-label="Popunjenost akcije" />
                  <span>{odabrano.zavrsena ? 'Završena akcija' : 'Još ' + (odabrano.kapacitet - odabrano.volonteri) + ' slobodnih mjesta'}</span>
                </div>
                <div className="redar-radnje">
                  {odabrano.zavrsena ? (
                    <button type="button" className="redar-gumb redar-gumb-glavni" title="Funkcionalnost još nije implementirana"><Ikona naziv="slika" />Pregled dokaza sanacije</button>
                  ) : (
                    <>
                      <button type="button" className="redar-gumb redar-gumb-glavni" title="Funkcionalnost još nije implementirana"><Ikona naziv="olovka" />Uredi akciju</button>
                      <button type="button" className="redar-gumb" title="Funkcionalnost još nije implementirana"><Ikona naziv="ljudi" />Volonteri</button>
                      <button type="button" className="redar-gumb" title="Funkcionalnost još nije implementirana"><Ikona naziv="sat" />Odgodi</button>
                    </>
                  )}
                </div>
              </>
            )}
            <p className="udruga-napomena">Prikaz koristi probne podatke. Gumbi za izmjene zasad su samo prikaz dizajna.</p>
          </section>
        )}
      </div>}
    </div>
  );
}
