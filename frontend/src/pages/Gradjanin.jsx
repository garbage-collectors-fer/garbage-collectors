
import { useEffect, useState } from 'react';
import KartaPrijava from '../components/KartaPrijava.jsx';
import { dohvatiPrijave } from '../services/prijaveServis.js';
import './Gradjanin.css';

const funkcije = [
  {
    naslov: 'Prijava odlagališta',
    stavke: [
      'Unijeti lokaciju, fotografiju i kategoriju otpada.',
      'Preuzeti lokaciju putem GPS-a ili je unijeti ručno.',
    ],
  },
  {
    naslov: 'Pregled karte',
    opis: 'Pregledavati odlagališta i detalje prijava: fotografiju, kategoriju, adresu ili koordinate, status i datum.',
  },
  {
    naslov: 'Moje prijave',
    stavke: [
      'Pratiti statuse vlastitih prijava i povijest promjena.',
      'Čitati obavijesti o promjenama unutar aplikacije.',
    ],
  },
  {
    naslov: 'Akcije čišćenja',
    stavke: [
      'Pregledavati termine, mjesta okupljanja, popunjenost i vremensku prognozu.',
      'Prijaviti se kao volonter ili odjaviti ako više ne može sudjelovati.',
    ],
  },
  {
    naslov: 'Kalendar i dolazak',
    stavke: [
      'Dodati akciju u Google kalendar s lokacijom, uputama i podsjetnikom dva sata prije početka.',
      'Prikazati mjesto okupljanja i rutu dolaska ako je dopušten pristup lokaciji.',
    ],
  },
];

export default function Gradjanin() {
  const [prijave, setPrijave] = useState([]);
  const [ucitavanje, setUcitavanje] = useState(true);
  const [greskaUcitavanja, setGreskaUcitavanja] = useState(null);
  const [odabranaPrijavaId, setOdabranaPrijavaId] = useState(null);

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

  return (
    <div className="gradjanin-stranica">
      <div className="gradjanin-zaglavlje">
        <p className="gradjanin-eyebrow">Pregled uloge</p>
        <h1>Građanin</h1>
        <p>
          Prijavljuje divlja odlagališta, prati rješavanje svojih prijava
          i sudjeluje u akcijama čišćenja.
        </p>
      </div>

      <div className="gradjanin-funkcije">
        {funkcije.map(function (funkcija) {
          return (
            <section className="gradjanin-kartica" key={funkcija.naslov}>
              <h2>{funkcija.naslov}</h2>

              {funkcija.opis && <p>{funkcija.opis}</p>}

              {funkcija.stavke && (
                <ul>
                  {funkcija.stavke.map(function (stavka) {
                    return <li key={stavka}>{stavka}</li>;
                  })}
                </ul>
              )}
            </section>
          );
        })}
      </div>

      <section className="gradjanin-karta-sekcija">
        <h2>Pregled karte odlagališta</h2>

        {ucitavanje && <p>Učitavanje karte...</p>}

        {greskaUcitavanja !== null && (
          <p className="gradjanin-poruka">{greskaUcitavanja}</p>
        )}

        {!ucitavanje && greskaUcitavanja === null && (
          <KartaPrijava
            prijave={prijave}
            odabranaPrijavaId={odabranaPrijavaId}
            onOdaberi={setOdabranaPrijavaId}
          />
        )}
      </section>
    </div>
  );
}
