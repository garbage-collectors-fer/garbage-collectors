import { useEffect, useRef, useState } from 'react';
import KartaPrijava from '../components/KartaPrijava.jsx';
import {
  dohvatiPrijave,
  dohvatiMojePrijave,
  posaljiNovuPrijavu,
  dohvatiKategorije,
} from '../services/prijaveServis.js';
import {
  nazivKategorije,
  nazivStatusa,
  bojaStatusa,
  formatirajDatum,
} from '../services/oznake.js';
import './KomunalniRedar.css';
import './Gradjanin.css';

const NAJVECA_VELICINA_SLIKE = 10 * 1024 * 1024;

function opisLokacije(prijava) {
  if (prijava.adresa) {
    return prijava.adresa;
  }
  return prijava.lat.toFixed(4) + ', ' + prijava.lng.toFixed(4);
}

function zanemariOdabir() {}

export default function Gradjanin() {
  const [prikaz, setPrikaz] = useState('SVE'); // 'SVE', 'MOJE' ili 'NOVA'
  const [prijave, setPrijave] = useState([]);
  const [mojePrijave, setMojePrijave] = useState([]);
  const [ucitavanje, setUcitavanje] = useState(true);
  const [greskaUcitavanja, setGreskaUcitavanja] = useState(null);
  const [odabranaPrijavaId, setOdabranaPrijavaId] = useState(null);
  const detaljiElement = useRef(null);

  function ucitajPrijave() {
    return Promise.all([dohvatiPrijave(), dohvatiMojePrijave()]).then(function (rezultati) {
      setPrijave(rezultati[0]);
      setMojePrijave(rezultati[1]);
    });
  }

  //ucitavanje prijava
  useEffect(function () {
    ucitajPrijave()
      .catch(function (greska) {
        setGreskaUcitavanja(greska.message);
      })
      .finally(function () {
        setUcitavanje(false);
      });
  }, []);

  //na mobitelu su detalji ispod karte pa se stranica spusti do njih
  useEffect(
    function () {
      if (odabranaPrijavaId === null || detaljiElement.current === null) {
        return;
      }
      if (window.matchMedia('(max-width: 900px)').matches) {
        detaljiElement.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    [odabranaPrijavaId]
  );

  function promijeniPrikaz(noviPrikaz) {
    setPrikaz(noviPrikaz);
    setOdabranaPrijavaId(null);
  }

  function obradiPoslanuPrijavu(novaPrijava) {
    ucitajPrijave().catch(function (greska) {
      setGreskaUcitavanja(greska.message);
    });
    setPrikaz('MOJE');
    setOdabranaPrijavaId(novaPrijava.id);
  }

  let prikazanePrijave = prijave;
  if (prikaz === 'MOJE') {
    prikazanePrijave = mojePrijave;
  }

  let odabranaPrijava = null;
  for (let i = 0; i < prikazanePrijave.length; i++) {
    if (prikazanePrijave[i].id === odabranaPrijavaId) {
      odabranaPrijava = prikazanePrijave[i];
    }
  }

  return (
    <div className="redar-stranica gradjanin-stranica">
      <div className="gradjanin-gornji-red">
        <div className="redar-filteri" role="group" aria-label="Koje prijave prikazati">
          <button
            type="button"
            aria-pressed={prikaz === 'SVE'}
            onClick={function () {
              promijeniPrikaz('SVE');
            }}
          >
            Sve prijave <span className="redar-broj">{prijave.length}</span>
          </button>
          <button
            type="button"
            aria-pressed={prikaz === 'MOJE'}
            onClick={function () {
              promijeniPrikaz('MOJE');
            }}
          >
            Moje prijave <span className="redar-broj">{mojePrijave.length}</span>
          </button>
        </div>

        {prikaz !== 'NOVA' && (
          <button
            type="button"
            className="redar-gumb redar-gumb-glavni"
            onClick={function () {
              promijeniPrikaz('NOVA');
            }}
          >
            + Prijavi otpad
          </button>
        )}
      </div>

      {ucitavanje && <p className="redar-prazno">Učitavanje...</p>}

      {greskaUcitavanja !== null && <p className="redar-poruka">{greskaUcitavanja}</p>}

      {!ucitavanje && greskaUcitavanja === null && prikaz === 'NOVA' && (
        <NovaPrijava
          postojecePrijave={prijave}
          onPoslano={obradiPoslanuPrijavu}
          onOdustani={function () {
            promijeniPrikaz('SVE');
          }}
        />
      )}

      {!ucitavanje && greskaUcitavanja === null && prikaz !== 'NOVA' && (
        <div className="redar-raspored">
          <section className="redar-popis" aria-label="Popis prijava">
            {prikazanePrijave.length === 0 && prikaz === 'SVE' && <p className="redar-prazno">Nema prijava.</p>}
            {prikazanePrijave.length === 0 && prikaz === 'MOJE' && (
              <p className="redar-prazno">Još nemaš prijava.</p>
            )}

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
                    setOdabranaPrijavaId(prijava.id);
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
              onOdaberi={setOdabranaPrijavaId}
            />

            {odabranaPrijava !== null && (
              <div ref={detaljiElement}>
                <DetaljiPrijave prijava={odabranaPrijava} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function DetaljiPrijave({ prijava }) {
  let provjera = 'Čeka provjeru redara';
  if (prijava.provjerena) {
    provjera = 'Prihvaćena';
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
          <dd>{nazivKategorije(prijava.kategorija)}</dd>
          <dt>Lokacija</dt>
          <dd>{opisLokacije(prijava)}</dd>
          <dt>Prijavljeno</dt>
          <dd>{formatirajDatum(prijava.datum)}</dd>
          <dt>Provjera</dt>
          <dd>{provjera}</dd>
        </dl>
      </div>
    </section>
  );
}

function NovaPrijava({ postojecePrijave, onPoslano, onOdustani }) {
  const [lokacija, setLokacija] = useState(null);
  const [porukaLokacije, setPorukaLokacije] = useState(null);
  const [kategorije, setKategorije] = useState([]);
  const [kategorija, setKategorija] = useState('');
  const [slika, setSlika] = useState(null);
  const [pregledSlike, setPregledSlike] = useState(null);
  const [greske, setGreske] = useState([]);
  const [slanjeUTijeku, setSlanjeUTijeku] = useState(false);

  function postaviMojuLokaciju() {
    if (!navigator.geolocation) {
      setPorukaLokacije('Preglednik ne podržava lokaciju. Odaberi mjesto na karti.');
      return;
    }
    setPorukaLokacije('Tražim lokaciju...');
    navigator.geolocation.getCurrentPosition(
      function (pozicija) {
        setLokacija({ lat: pozicija.coords.latitude, lng: pozicija.coords.longitude });
        setPorukaLokacije(null);
      },
      function () {
        setPorukaLokacije('Lokacija nije dopuštena. Odaberi mjesto na karti.');
      }
    );
  }

  useEffect(function () {
    dohvatiKategorije()
      .then(function (dohvaceno) {
        setKategorije(dohvaceno);
      })
      .catch(function () {
        setKategorije([]);
      });
  }, []);

  //odmah pokusaj uzeti trenutnu lokaciju
  useEffect(function () {
    postaviMojuLokaciju();
  }, []);

  function odaberiMjestoNaKarti(lat, lng) {
    setLokacija({ lat: lat, lng: lng });
    setPorukaLokacije(null);
  }

  function odaberiSliku(dogadaj) {
    const datoteka = dogadaj.target.files[0];
    if (pregledSlike !== null) {
      URL.revokeObjectURL(pregledSlike);
    }
    setSlika(null);
    setPregledSlike(null);

    if (!datoteka) {
      return;
    }
    if (datoteka.type !== 'image/jpeg' && datoteka.type !== 'image/png') {
      setGreske(['Slika mora biti JPG ili PNG.']);
      dogadaj.target.value = '';
      return;
    }
    if (datoteka.size > NAJVECA_VELICINA_SLIKE) {
      setGreske(['Slika može imati najviše 10 MB.']);
      dogadaj.target.value = '';
      return;
    }

    setGreske([]);
    setSlika(datoteka);
    setPregledSlike(URL.createObjectURL(datoteka));
  }

  function posaljiPrijavu() {
    const noveGreske = [];
    if (lokacija === null) {
      noveGreske.push('Odaberi lokaciju na karti.');
    }
    if (kategorija === '') {
      noveGreske.push('Odaberi kategoriju otpada.');
    }
    if (slika === null) {
      noveGreske.push('Dodaj fotografiju.');
    }
    setGreske(noveGreske);
    if (noveGreske.length > 0) {
      return;
    }

    setSlanjeUTijeku(true);
    posaljiNovuPrijavu(slika, lokacija.lat, lokacija.lng, Number(kategorija))
      .then(function (novaPrijava) {
        onPoslano(novaPrijava);
      })
      .catch(function (greska) {
        setGreske([greska.message]);
        setSlanjeUTijeku(false);
      });
  }

  let tekstLokacije = 'Nije odabrana';
  if (lokacija !== null) {
    tekstLokacije = lokacija.lat.toFixed(4) + ', ' + lokacija.lng.toFixed(4);
  }

  return (
    <div className="redar-raspored">
      <section className="gradjanin-forma" aria-label="Nova prijava">
        <h2>Nova prijava</h2>

        <div className="gradjanin-polje">
          <span className="gradjanin-oznaka">Lokacija</span>
          <div className="gradjanin-lokacija">
            <span>{tekstLokacije}</span>
            <button type="button" className="redar-gumb gradjanin-gumb-mali" onClick={postaviMojuLokaciju}>
              Moja lokacija
            </button>
          </div>
          {porukaLokacije !== null && <span className="gradjanin-napomena">{porukaLokacije}</span>}
        </div>

        <div className="gradjanin-polje">
          <label className="gradjanin-oznaka" htmlFor="nova-kategorija">
            Kategorija
          </label>
          <select
            id="nova-kategorija"
            value={kategorija}
            onChange={function (dogadaj) {
              setKategorija(dogadaj.target.value);
            }}
          >
            <option value="">Odaberi kategoriju</option>
            {kategorije.map(function (kat) {
              return (
                <option key={kat.id} value={kat.id}>
                  {kat.naziv}
                </option>
              );
            })}
          </select>
          {kategorije.length === 0 && <span className="gradjanin-napomena">Kategorije trenutno nisu dostupne.</span>}
        </div>

        <div className="gradjanin-polje">
          <label className="gradjanin-oznaka" htmlFor="nova-slika">
            Fotografija
          </label>
          <input id="nova-slika" type="file" accept="image/jpeg,image/png" onChange={odaberiSliku} />
          {pregledSlike !== null && <img className="gradjanin-pregled-slike" src={pregledSlike} alt="Odabrana fotografija" />}
        </div>

        {greske.length > 0 && (
          <ul className="redar-poruka gradjanin-greske" role="alert">
            {greske.map(function (greska) {
              return <li key={greska}>{greska}</li>;
            })}
          </ul>
        )}

        <div className="redar-radnje">
          <button type="button" className="redar-gumb redar-gumb-glavni" disabled={slanjeUTijeku} onClick={posaljiPrijavu}>
            Pošalji prijavu
          </button>
          <button type="button" className="redar-gumb" disabled={slanjeUTijeku} onClick={onOdustani}>
            Odustani
          </button>
        </div>
      </section>

      <div className="redar-desno">
        <p className="gradjanin-napomena">Klikni na kartu da postaviš lokaciju otpada.</p>
        <KartaPrijava
          prijave={postojecePrijave}
          odabranaPrijavaId={null}
          onOdaberi={zanemariOdabir}
          onKlikNaKartu={odaberiMjestoNaKarti}
          odabranaLokacija={lokacija}
        />
      </div>
    </div>
  );
}
