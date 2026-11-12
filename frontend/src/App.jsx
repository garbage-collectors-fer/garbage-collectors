import { useState, useEffect } from 'react';
import Prijava from './pages/Prijava.jsx';
import Gradjanin from './pages/Gradjanin.jsx';
import EkoUdruga from './pages/EkoUdruga.jsx';
import KomunalniRedar from './pages/KomunalniRedar.jsx';
import {
  dohvatiPrijavljenogKorisnika,
  odjaviSe,
  normalizirajUlogu,
} from './services/autentikacijaServis.js';

//ako Google prijava ne uspije
function porukaGreskePrijave() {
  const parametri = new URLSearchParams(window.location.search);
  if (parametri.has('error')) {
    return 'Prijava nije uspjela. Provjerite koristite li Google račun koji je registriran u sustavu.';
  }
  return null;
}

export default function App() {
  const [korisnik, setKorisnik] = useState(null);
  const [ucitavanje, setUcitavanje] = useState(true);
  const [greska, setGreska] = useState(porukaGreskePrijave());

  //pri otvaranju aplikacije provjeri je li netko prijavljen.
  useEffect(function () {
    dohvatiPrijavljenogKorisnika()
      .then(function (prijavljeniKorisnik) {
        setKorisnik(prijavljeniKorisnik);
      })
      .catch(function (greskaProvjere) {
        setGreska(greskaProvjere.message);
      })
      .finally(function () {
        setUcitavanje(false);
      });
  }, []);

  async function obradiOdjavu() {
    try {
      await odjaviSe();
      setKorisnik(null);
    } catch (greskaOdjave) {
      setGreska(greskaOdjave.message);
    }
  }

  if (ucitavanje) {
    return <main>Učitavanje...</main>;
  }

  //prikazi stranicu za prijavu.
  if (korisnik === null) {
    return (
      <main>
        <Prijava greska={greska} />
      </main>
    );
  }

  const uloga = normalizirajUlogu(korisnik.uloga);

  let stranica = null;
  if (uloga === 'GRADANIN') {
    stranica = <Gradjanin />;
  } else if (uloga === 'UDRUGA') {
    stranica = <EkoUdruga />;
  } else if (uloga === 'REDAR') {
    stranica = <KomunalniRedar />;
  } else {
    stranica = <p>Vaš račun nema dodijeljenu ulogu. Javite se administratoru.</p>;
  }

  return (
    <>
      <header className="zaglavlje">
        <div className="zaglavlje-sadrzaj">
          <div>
            <span className="zaglavlje-naziv">EcoSentry</span>
            <span className="zaglavlje-opis">Prijava i sanacija odlagališta</span>
          </div>
          <div className="zaglavlje-korisnik">
            <span className="zaglavlje-ime">{korisnik.ime}</span>
            <button type="button" className="zaglavlje-odjava" onClick={obradiOdjavu}>
              Odjava
            </button>
          </div>
        </div>
      </header>
      {greska && <p role="alert">{greska}</p>}
      <main>{stranica}</main>
    </>
  );
}
