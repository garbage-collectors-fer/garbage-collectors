//stranica za prijavu

import { prijaviSeGoogleom } from '../services/autentikacijaServis.js';
import './Prijava.css';

export default function Prijava({ greska }) {
  return (
    <div className="prijava-stranica">
      <div className="prijava-kartica">
        <div className="prijava-ikona" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="36" height="36">
            <path
              d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14zm0 0c3-4 6-7 10-9"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1>EcoSentry</h1>
        <p className="prijava-slogan">Zajedno za čišći grad</p>
        <p className="prijava-opis">Prijavi divlje odlagalište i prati kako se čisti.</p>

        {greska && <p className="prijava-greska">{greska}</p>}

        <button type="button" className="prijava-gumb" onClick={prijaviSeGoogleom}>
          Započni s čišćenjem
        </button>
        <p className="prijava-napomena">
          Prijava Google računom. Novi korisnici registriraju se automatski.
        </p>
      </div>
    </div>
  );
}
