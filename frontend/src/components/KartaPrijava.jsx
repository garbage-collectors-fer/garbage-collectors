
import { useEffect, useRef, useState } from 'react';
import { bojaStatusa, nazivStatusa } from '../services/oznake.js';

const GOOGLE_MAPS_KLJUC = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const GOOGLE_MAPS_MAP_ID = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID || 'DEMO_MAP_ID';
const SREDISTE_ZAGREBA = { lat: 45.815, lng: 15.98 };


let ucitavanjeKarte = null;

function ucitajGoogleMaps() {
  if (window.google && window.google.maps && window.google.maps.marker) {
    return Promise.resolve();
  }
  if (ucitavanjeKarte !== null) {
    return ucitavanjeKarte;
  }

  ucitavanjeKarte = new Promise(function (resolve, reject) {
    window.ecoSentryKartaSpremna = function () {
      resolve();
    };

    const skripta = document.createElement('script');
    skripta.src =
      'https://maps.googleapis.com/maps/api/js?key=' +
      GOOGLE_MAPS_KLJUC +
      '&libraries=marker&loading=async&callback=ecoSentryKartaSpremna';
    skripta.async = true;
    skripta.onerror = function () {
      ucitavanjeKarte = null;
      reject(new Error('Google karta se nije uspjela učitati.'));
    };
    document.head.appendChild(skripta);
  });

  return ucitavanjeKarte;
}

export default function KartaPrijava({ prijave, odabranaPrijavaId, onOdaberi }) {
  const elementKarte = useRef(null);
  const karta = useRef(null);
  const pribadace = useRef([]);
  const [kartaSpremna, setKartaSpremna] = useState(false);
  const [greska, setGreska] = useState(null);

  useEffect(function () {
    if (!GOOGLE_MAPS_KLJUC) {
      return;
    }

    window.gm_authFailure = function () {
      setGreska('Google Maps ključ nije ispravan ili nema dozvolu za Maps JavaScript API.');
    };

    ucitajGoogleMaps()
      .then(function () {
        karta.current = new window.google.maps.Map(elementKarte.current, {
          center: SREDISTE_ZAGREBA,
          zoom: 12,
          mapId: GOOGLE_MAPS_MAP_ID,
          streetViewControl: false,
          mapTypeControl: false,
        });
        setKartaSpremna(true);
      })
      .catch(function (greskaUcitavanja) {
        setGreska(greskaUcitavanja.message);
      });
  }, []);

  useEffect(
    function () {
      if (!kartaSpremna) {
        return;
      }

      for (let i = 0; i < pribadace.current.length; i++) {
        pribadace.current[i].map = null;
      }
      pribadace.current = [];

      for (let i = 0; i < prijave.length; i++) {
        const prijava = prijave[i];
        const jeOdabrana = prijava.id === odabranaPrijavaId;

        let velicina = 1;
        if (jeOdabrana) {
          velicina = 1.4;
        }

        const izgledPribadace = new window.google.maps.marker.PinElement({
          background: bojaStatusa(prijava.status),
          borderColor: '#3F4B3B',
          glyphColor: '#ffffff',
          scale: velicina,
        });

        const pribadaca = new window.google.maps.marker.AdvancedMarkerElement({
          map: karta.current,
          position: { lat: prijava.lat, lng: prijava.lng },
          content: izgledPribadace.element,
          title: 'Prijava #' + prijava.id + ' (' + nazivStatusa(prijava.status) + ')',
          gmpClickable: true,
        });

        pribadaca.addListener('click', function () {
          onOdaberi(prijava.id);
        });

        pribadace.current.push(pribadaca);
      }
    },
    [kartaSpremna, prijave, odabranaPrijavaId, onOdaberi]
  );

  useEffect(
    function () {
      if (!kartaSpremna || odabranaPrijavaId === null) {
        return;
      }
      for (let i = 0; i < prijave.length; i++) {
        if (prijave[i].id === odabranaPrijavaId) {
          karta.current.panTo({ lat: prijave[i].lat, lng: prijave[i].lng });
        }
      }
    },
    [kartaSpremna, odabranaPrijavaId, prijave]
  );

  if (!GOOGLE_MAPS_KLJUC) {
    return (
      <div className="karta karta-poruka">
        Karta još nije dostupna.
      </div>
    );
  }

  if (greska !== null) {
    return <div className="karta karta-poruka">{greska}</div>;
  }

  return <div className="karta" ref={elementKarte}></div>;
}
