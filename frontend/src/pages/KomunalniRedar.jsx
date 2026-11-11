import { useCallback, useEffect, useState } from 'react';
import KartaPrijava from '../components/KartaPrijava.jsx';
import {
  dohvatiPrijave,
  prihvatiPrijavu,
  odbaciPrijavu,
  posaljiEkoUdrugama,
  posaljiNaSluzbenuSanaciju,
  promijeniKategoriju,
} from '../services/prijaveServis.js';
import {
  KATEGORIJE,
  nazivKategorije,
  nazivStatusa,
  nazivNacinaSanacije,
  bojaStatusa,
  formatirajDatum,
} from '../services/oznake.js';
import './KomunalniRedar.css';

//nova prijava
function jeNova(prijava) {
  return prijava.provjerena === false && prijava.status === 'PRIJAVLJENO';
}

//prihvacena prijava
function cekaOdluku(prijava) {
  return prijava.provjerena === true && prijava.status === 'PRIJAVLJENO' && prijava.nacinSanacije === null;
}

function opisLokacije(prijava) {
  if (prijava.adresa) {
    return prijava.adresa;
  }
  return prijava.lat.toFixed(4) + ', ' + prijava.lng.toFixed(4);
}

export default function KomunalniRedar() {
  const [prijave, setPrijave] = useState([]);
  const [ucitavanje, setUcitavanje] = useState(true);
  const [greskaUcitavanja, setGreskaUcitavanja] = useState(null);
  const [prikaz, setPrikaz] = useState('NOVE'); // 'NOVE', 'ZA_ODLUKU' ili 'SVE'
  const [odabranaPrijavaId, setOdabranaPrijavaId] = useState(null);
  const [radnjaUTijeku, setRadnjaUTijeku] = useState(false);
  const [poruka, setPoruka] = useState(null);

  //ucitavanje prijava
  useEffect(function () {
    dohvatiPrijave()
      .then(function (dohvaceno) {
        setPrijave(dohvaceno);
      })
      .catch(function (greska) {
        setGreskaUcitavanja(greska.message);
      })
      .finally(function () {
        setUcitavanje(false);
      });
  }, []);

  //da karta ne crta pribadace ispocetka
  const odaberiPrijavu = useCallback(function (id) {
    setOdabranaPrijavaId(id);
    setPoruka(null);
  }, []);

  //prijave
  const prikazanePrijave = [];
  for (let i = 0; i < prijave.length; i++) {
    const prijava = prijave[i];
    if (prikaz === 'SVE') {
      prikazanePrijave.push(prijava);
    } else if (prikaz === 'NOVE' && jeNova(prijava)) {
      prikazanePrijave.push(prijava);
    } else if (prikaz === 'ZA_ODLUKU' && cekaOdluku(prijava)) {
      prikazanePrijave.push(prijava);
    }
  }
  prikazanePrijave.sort(function (prva, druga) {
    return new Date(druga.datum) - new Date(prva.datum);
  });

  let brojNovih = 0;
  let brojZaOdluku = 0;
  for (let i = 0; i < prijave.length; i++) {
    if (jeNova(prijave[i])) {
      brojNovih = brojNovih + 1;
    }
    if (cekaOdluku(prijave[i])) {
      brojZaOdluku = brojZaOdluku + 1;
    }
  }

  let odabranaPrijava = null;
  for (let i = 0; i < prijave.length; i++) {
    if (prijave[i].id === odabranaPrijavaId) {
      odabranaPrijava = prijave[i];
    }
  }


  function azurirajPrijavu(novaPrijava) {
    const noviPopis = [];
    for (let i = 0; i < prijave.length; i++) {
      if (prijave[i].id === novaPrijava.id) {
        noviPopis.push(novaPrijava);
      } else {
        noviPopis.push(prijave[i]);
      }
    }
    setPrijave(noviPopis);
  }

  function ukloniPrijavu(id) {
    const noviPopis = [];
    for (let i = 0; i < prijave.length; i++) {
      if (prijave[i].id !== id) {
        noviPopis.push(prijave[i]);
      }
    }
    setPrijave(noviPopis);
    setOdabranaPrijavaId(null);
  }

  async function izvrsiRadnju(radnja) {
    setRadnjaUTijeku(true);
    setPoruka(null);
    try {
      await radnja();
    } catch (greska) {
      setPoruka({ vrsta: 'greska', tekst: greska.message });
    }
    setRadnjaUTijeku(false);
  }

  function obradiPrihvacanje(id) {
    izvrsiRadnju(async function () {
      azurirajPrijavu(await prihvatiPrijavu(id));
    });
  }

  function obradiOdbacivanje(id) {
    izvrsiRadnju(async function () {
      await odbaciPrijavu(id);
      ukloniPrijavu(id);
    });
  }

  function obradiSlanjeUdrugama(id) {
    izvrsiRadnju(async function () {
      azurirajPrijavu(await posaljiEkoUdrugama(id));
    });
  }

  function obradiSluzbenuSanaciju(id) {
    izvrsiRadnju(async function () {
      await posaljiNaSluzbenuSanaciju(id);
      ukloniPrijavu(id);
    });
  }

  function obradiPromjenuKategorije(id, novaKategorija) {
    izvrsiRadnju(async function () {
      azurirajPrijavu(await promijeniKategoriju(id, novaKategorija));
    });
  }

  return (
    <div className="redar-stranica">
      <h1 className="redar-naslov">Prijave</h1>

      <div className="redar-filteri" role="group" aria-label="Koje prijave prikazati">
        <button
          type="button"
          aria-pressed={prikaz === 'NOVE'}
          onClick={function () {
            setPrikaz('NOVE');
          }}
        >
          Nove <span className="redar-broj">{brojNovih}</span>
        </button>
        <button
          type="button"
          aria-pressed={prikaz === 'ZA_ODLUKU'}
          onClick={function () {
            setPrikaz('ZA_ODLUKU');
          }}
        >
          Za odluku <span className="redar-broj">{brojZaOdluku}</span>
        </button>
        <button
          type="button"
          aria-pressed={prikaz === 'SVE'}
          onClick={function () {
            setPrikaz('SVE');
          }}
        >
          Sve <span className="redar-broj">{prijave.length}</span>
        </button>
      </div>

      {poruka !== null && (
        <p className="redar-poruka" role="alert">
          {poruka.tekst}
        </p>
      )}

      {ucitavanje && <p className="redar-prazno">Učitavanje...</p>}

      {greskaUcitavanja !== null && (
        <p className="redar-poruka">{greskaUcitavanja}</p>
      )}

      {!ucitavanje && greskaUcitavanja === null && (
        <div className="redar-raspored">
          <section className="redar-popis" aria-label="Popis prijava">
            {prikazanePrijave.length === 0 && <p className="redar-prazno">Nema prijava.</p>}

            {prikazanePrijave.map(function (prijava) {
              let klasa = 'redar-stavka';
              if (prijava.id === odabranaPrijavaId) {
                klasa = klasa + ' redar-stavka-odabrana';
              }
              return (
                <button
                  type="button"
                  key={prijava.id}
                  className={klasa}
                  onClick={function () {
                    odaberiPrijavu(prijava.id);
                  }}
                >
                  <span
                    className="redar-status-tocka"
                    style={{ background: bojaStatusa(prijava.status) }}
                    title={nazivStatusa(prijava.status)}
                  ></span>
                  <span className="redar-stavka-tekst">
                    <span className="redar-stavka-naslov">{nazivKategorije(prijava.kategorija)}</span>
                    <span className="redar-stavka-detalj">{opisLokacije(prijava)}</span>
                  </span>
                  <span className="redar-stavka-id">#{prijava.id}</span>
                </button>
              );
            })}
          </section>

          <div className="redar-desno">
            <KartaPrijava
              prijave={prikazanePrijave}
              odabranaPrijavaId={odabranaPrijavaId}
              onOdaberi={odaberiPrijavu}
            />

            {odabranaPrijava !== null && (
              <DetaljiPrijave
                key={odabranaPrijava.id}
                prijava={odabranaPrijava}
                radnjaUTijeku={radnjaUTijeku}
                onPrihvati={obradiPrihvacanje}
                onOdbaci={obradiOdbacivanje}
                onPosaljiUdrugama={obradiSlanjeUdrugama}
                onSluzbenaSanacija={obradiSluzbenuSanaciju}
                onPromijeniKategoriju={obradiPromjenuKategorije}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function DetaljiPrijave({
  prijava,
  radnjaUTijeku,
  onPrihvati,
  onOdbaci,
  onPosaljiUdrugama,
  onSluzbenaSanacija,
  onPromijeniKategoriju,
}) {
  const [potvrdaOdbacivanja, setPotvrdaOdbacivanja] = useState(false);

  let prijavitelj = '-';
  if (prijava.prijavitelj) {
    prijavitelj = prijava.prijavitelj.ime;
  }

  return (
    <section className="redar-detalji" aria-label={'Prijava ' + prijava.id}>
      <img className="redar-slika" src={prijava.slikaUrl} alt={'Otpad, prijava ' + prijava.id} />

      <div className="redar-detalji-sadrzaj">
        <div className="redar-detalji-zaglavlje">
          <h2>Prijava #{prijava.id}</h2>
          <span className="redar-status">
            <span className="redar-status-tocka" style={{ background: bojaStatusa(prijava.status) }}></span>
            {nazivStatusa(prijava.status)}
          </span>
        </div>

        <dl className="redar-podaci">
          <dt>Kategorija</dt>
          <dd>
            <select
              aria-label="Kategorija otpada"
              value={prijava.kategorija}
              disabled={radnjaUTijeku}
              onChange={function (dogadaj) {
                onPromijeniKategoriju(prijava.id, dogadaj.target.value);
              }}
            >
              {KATEGORIJE.map(function (kategorija) {
                return (
                  <option key={kategorija} value={kategorija}>
                    {nazivKategorije(kategorija)}
                  </option>
                );
              })}
            </select>
          </dd>
          <dt>Lokacija</dt>
          <dd>{opisLokacije(prijava)}</dd>
          <dt>Datum</dt>
          <dd>{formatirajDatum(prijava.datum)}</dd>
          <dt>Prijavio</dt>
          <dd>{prijavitelj}</dd>
          {prijava.nacinSanacije !== null && (
            <>
              <dt>Sanacija</dt>
              <dd>{nazivNacinaSanacije(prijava.nacinSanacije)}</dd>
            </>
          )}
        </dl>

        
        {jeNova(prijava) && !potvrdaOdbacivanja && (
          <div className="redar-radnje">
            <button
              type="button"
              className="redar-gumb redar-gumb-glavni"
              disabled={radnjaUTijeku}
              onClick={function () {
                onPrihvati(prijava.id);
              }}
            >
              Prihvati
            </button>
            <button
              type="button"
              className="redar-gumb"
              disabled={radnjaUTijeku}
              onClick={function () {
                setPotvrdaOdbacivanja(true);
              }}
            >
              Odbaci
            </button>
          </div>
        )}

        {jeNova(prijava) && potvrdaOdbacivanja && (
          <div className="redar-radnje">
            <span className="redar-pitanje">Odbaciti prijavu?</span>
            <button
              type="button"
              className="redar-gumb redar-gumb-glavni"
              disabled={radnjaUTijeku}
              onClick={function () {
                onOdbaci(prijava.id);
              }}
            >
              Da
            </button>
            <button
              type="button"
              className="redar-gumb"
              disabled={radnjaUTijeku}
              onClick={function () {
                setPotvrdaOdbacivanja(false);
              }}
            >
              Ne
            </button>
          </div>
        )}

        
        {cekaOdluku(prijava) && (
          <div className="redar-radnje">
            <button
              type="button"
              className="redar-gumb redar-gumb-glavni"
              disabled={radnjaUTijeku}
              onClick={function () {
                onPosaljiUdrugama(prijava.id);
              }}
            >
              Eko-udrugama
            </button>
            <button
              type="button"
              className="redar-gumb"
              disabled={radnjaUTijeku}
              onClick={function () {
                onSluzbenaSanacija(prijava.id);
              }}
            >
              Službena sanacija
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
