
import { useEffect, useState } from 'react';
import KartaPrijava from '../components/KartaPrijava.jsx';
import { dohvatiPrijave } from '../services/prijaveServis.js';
import {
  nazivKategorije,
  nazivStatusa,
  bojaStatusa,
  formatirajDatum,
  KATEGORIJE
} from '../services/oznake.js';
import './Gradjanin.css';

//privremena slika kalendara dok nemamo kalendar
import kalendarSlika from '../assets/images/kalendar.jpg';

const funkcije = [
  {
    naslov: 'Moje prijave',
    stavke: [
        'Nemate prijava',
    ],
  },
  {
    naslov: 'Akcije čišćenja',
    stavke: [
        'Nema dostupnih akcija čišćenja',
    ],
  },
  {
    naslov: 'Kalendar i dolazak',
    stavke: [
        'Slika kalendara dok nema funkcionalnosti',
    ],
    slika: kalendarSlika,
  },
];

function zanemariOdabir() {}

export default function Gradjanin() {
const [odabranaPrijavaId, setOdabranaPrijavaId] = useState(null);
const [prijavaOtvorena, setPrijavaOtvorena] = useState(false);
const [kategorija, setKategorija] = useState('');
const [slika, setSlika] = useState(null);

const [prijave, setPrijave] = useState([]);
const [ucitavanjePrijava, setUcitavanjePrijava] = useState(true);
const [greskaUcitavanjaPrijava, setGreskaUcitavanjaPrijava] = useState(null);

useEffect(() => {
    dohvatiPrijave()
        .then((dohvaceno) => {
            setPrijave(dohvaceno);
        })
        .catch((greska) => {
            setGreskaUcitavanjaPrijava(greska.message);
        })
        .finally(() => {
            setUcitavanjePrijava(false);
        });
}, []);

function zatvoriPrijavu() {
    setKategorija('');
    setSlika(null);
    setPrijavaOtvorena(false);
}

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

    <section className="gradjanin-prijava">

        {!prijavaOtvorena ? (
            <button
                type="button"
                onClick={() => setPrijavaOtvorena(true)}
            >
                Prijavi otpad
            </button>
        ) : (
            <div className="gradjanin-prijava-forma">

                <h2>Prijava otpada</h2>

                {/* Kategorija */}
                <div className="gradjanin-forma-polje">
                    <label htmlFor="kategorija">
                        Kategorija
                    </label>

                    <select
                        id="kategorija"
                        value={kategorija}
                        onChange={(e) => setKategorija(e.target.value)}
                    >
                        <option value="">Odaberite kategoriju</option>

                        {KATEGORIJE.map((kat) => (
                            <option key={kat} value={kat}>
                                {kat}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Slika otpada */}
                <div className="gradjanin-forma-polje">
                    <label htmlFor="slika-otpada">
                        Slika otpada
                    </label>

                    <input
                        id="slika-otpada"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setSlika(e.target.files[0] || null)}
                    />

                    {slika && (
                        <p>Odabrana slika: {slika.name}</p>
                    )}

                    {slika && (
                        <img
                            src={URL.createObjectURL(slika)}
                            alt="Odabrani otpad"
                            style={{ maxWidth: '300px', display: 'block' }}
                        />
                    )}
                </div>

                {/* Karta */}
                <section className="gradjanin-karta-sekcija">
                    <h3>Pregled karte odlagališta</h3>

                    {ucitavanjePrijava && <p>Učitavanje karte...</p>}

                    {greskaUcitavanjaPrijava !== null && (
                        <p>{greskaUcitavanjaPrijava}</p>
                    )}

                    {!ucitavanjePrijava &&
                        greskaUcitavanjaPrijava === null && (
                            <KartaPrijava
                                prijave={prijave}
                                odabranaPrijavaId={null}
                                onOdaberi={() => {}}
                            />
                        )}
                </section>

                {/* Gumb za prijavu */}
                <button
                    type="button"
                    onClick={zatvoriPrijavu}
                >
                    Prijavi
                </button>

            </div>
        )}

    </section>

    <section className="gradjanin-karta-sekcija">
        <h2>Pregled karte odlagališta</h2>

        {ucitavanjePrijava && <p>Učitavanje karte...</p>}

        {greskaUcitavanjaPrijava !== null && (
            <p className="gradjanin-poruka">
                {greskaUcitavanjaPrijava}
            </p>
        )}

        {!ucitavanjePrijava && greskaUcitavanjaPrijava === null && (
            <KartaPrijava
                prijave={prijave}
                odabranaPrijavaId={odabranaPrijavaId}
                onOdaberi={setOdabranaPrijavaId}
            />
        )}
    </section>

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

                {funkcija.slika && (
                    <img
                        src={funkcija.slika}
                        alt={funkcija.naslov}
                        className="gradjanin-funkcija-slika"
                    />
                )}
            </section>
            );
        })}
    </div>
    </div>
  );
}
