import { useEffect, useState } from 'react';
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
  };
  return <svg className="udruga-ikona" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d={putanje[naziv]} /></svg>;
}

function FotografijaOdlagalista({ prijava }) {
  const [greskaSlike, setGreskaSlike] = useState(false);

  return (
    <figure className="udruga-fotografija">
      {prijava.slikaUrl && !greskaSlike ? (
        <img
          src={prijava.slikaUrl}
          alt={`Fotografija otpada na odlagalištu, prijava #${prijava.id}`}
          onError={() => setGreskaSlike(true)}
        />
      ) : (
        <div className="udruga-fotografija-prazna">
          <Ikona naziv="slika" />
          <span>Fotografija nije dostupna.</span>
        </div>
      )}
      <figcaption>Fotografija iz prijave odlagališta</figcaption>
    </figure>
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

  useEffect(() => {
    dohvatiPrijave()
      .then((dohvaceno) => setPrijave(dohvaceno))
      .catch(() => setGreska('Prijave se nisu uspjele učitati. Pokušaj osvježiti stranicu.'))
      .finally(() => setUcitavanje(false));
  }, []);

  const dostupne = prijave.filter((p) => p.provjerena && p.status === 'PRIJAVLJENO' && p.nacinSanacije === 'UDRUGA');
  const popis = prikaz === 'ODLAGALISTA' ? dostupne : akcije.filter((a) => a.zavrsena === (prikaz === 'ZAVRSENE'));
  const odabrano = popis.find((stavka) => stavka.id === odabraniId) || popis[0];
  const kartice = [
    { id: 'AKCIJE', naziv: 'Moje akcije', ikona: 'kalendar', broj: akcije.filter((a) => !a.zavrsena).length },
    { id: 'ODLAGALISTA', naziv: 'Dostupna odlagališta', ikona: 'lokacija', broj: dostupne.length },
    { id: 'ZAVRSENE', naziv: 'Završene akcije', ikona: 'potvrda', broj: akcije.filter((a) => a.zavrsena).length },
  ];

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

      <div className="redar-raspored">
        <section className="redar-popis" aria-label="Popis za eko-udrugu">
          {popis.map((stavka) => (
            <button key={stavka.id} type="button" aria-pressed={odabrano?.id === stavka.id} className={'redar-stavka' + (odabrano?.id === stavka.id ? ' redar-stavka-odabrana' : '')} onClick={() => setOdabraniId(stavka.id)}>
              <span className="udruga-stavka-ikona"><Ikona naziv={prikaz === 'ODLAGALISTA' ? 'lokacija' : stavka.zavrsena ? 'potvrda' : 'list'} /></span>
              <span className="redar-stavka-tekst">
                <span className="redar-stavka-naslov">{prikaz === 'ODLAGALISTA' ? nazivKategorije(stavka.kategorija) : stavka.naziv}</span>
                <span className="redar-stavka-detalj">{stavka.lokacija || stavka.adresa || `${stavka.lat.toFixed(4)}, ${stavka.lng.toFixed(4)}`}</span>
                <span className="udruga-stavka-datum"><Ikona naziv={prikaz === 'ODLAGALISTA' ? 'potvrda' : 'kalendar'} />{prikaz === 'ODLAGALISTA' ? 'Dostupno za akciju' : stavka.datum}</span>
              </span>
            </button>
          ))}
          {prikaz === 'ODLAGALISTA' && ucitavanje && <p role="status">Učitavanje odlagališta...</p>}
          {prikaz === 'ODLAGALISTA' && greska && <p role="alert">{greska}</p>}
          {popis.length === 0 && !(prikaz === 'ODLAGALISTA' && (ucitavanje || greska)) && <p className="redar-prazno">Trenutačno nema stavki.</p>}
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
                    prijave={dostupne}
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
      </div>
    </div>
  );
}
