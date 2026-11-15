
import { prijave as mockPrijave } from './mockPodaci.js';
import { API_ADRESA, procitajXsrfToken } from './autentikacijaServis.js';

const KORISTI_MOCK = false;


function pricekaj() {
  return new Promise(function (resolve) {
    setTimeout(resolve, 300);
  });
}


async function posaljiZahtjev(metoda, putanja, tijelo) {
  const postavke = {
    method: metoda,
    credentials: 'include',
    headers: {},
  };

  if (metoda !== 'GET') {
    const xsrfToken = procitajXsrfToken();
    if (xsrfToken !== null) {
      postavke.headers['X-XSRF-TOKEN'] = xsrfToken;
    }
  }

  if (tijelo instanceof FormData) {
    postavke.body = tijelo;
  } else if (tijelo !== undefined) {
    postavke.headers['Content-Type'] = 'application/json';
    postavke.body = JSON.stringify(tijelo);
  }

  const odgovor = await fetch(API_ADRESA + '/api' + putanja, postavke);

  if (!odgovor.ok) {
    let poruka = 'Došlo je do greške (' + odgovor.status + ').';
    try {
      const podaciGreske = await odgovor.json();
      if (podaciGreske.poruka) {
        poruka = podaciGreske.poruka;
      }
    } catch (greska) {
    }
    throw new Error(poruka);
  }

  return odgovor.json();
}

function pronadiMockPrijavu(id) {
  for (let i = 0; i < mockPrijave.length; i++) {
    if (mockPrijave[i].id === id) {
      return mockPrijave[i];
    }
  }
  throw new Error('Prijava ne postoji.');
}


export async function dohvatiPrijave() {
  if (KORISTI_MOCK) {
    await pricekaj();
    const rezultat = [];
    for (let i = 0; i < mockPrijave.length; i++) {
      const status = mockPrijave[i].status;
      if (status !== 'ODBACENO' && status !== 'SLUZBENA_SANACIJA') {
        rezultat.push({ ...mockPrijave[i] });
      }
    }
    return rezultat;
  }
  return posaljiZahtjev('GET', '/prijave');
}


//prijave prijavljenog gradanina
export async function dohvatiMojePrijave() {
  if (KORISTI_MOCK) {
    await pricekaj();
    const rezultat = [];
    for (let i = 0; i < mockPrijave.length; i++) {
      if (mockPrijave[i].mojaPrijava === true) {
        rezultat.push({ ...mockPrijave[i] });
      }
    }
    return rezultat;
  }
  return posaljiZahtjev('GET', '/prijave/moje');
}


//nova prijava gradanina
export async function posaljiNovuPrijavu(slika, lat, lng, kategorija) {
  if (KORISTI_MOCK) {
    await pricekaj();
    const novaPrijava = {
      id: 1000 + mockPrijave.length,
      lat: lat,
      lng: lng,
      adresa: null,
      kategorija: kategorija,
      status: 'PRIJAVLJENO',
      provjerena: false,
      nacinSanacije: null,
      slikaUrl: URL.createObjectURL(slika),
      datum: new Date().toISOString(),
      prijavitelj: { id: 0, ime: 'Ja' },
      mojaPrijava: true,
    };
    mockPrijave.push(novaPrijava);
    return { ...novaPrijava };
  }
  const podaci = new FormData();
  podaci.append('slika', slika);
  podaci.append('lat', lat);
  podaci.append('lng', lng);
  podaci.append('kategorija', kategorija);
  return posaljiZahtjev('POST', '/prijave', podaci);
}


export async function prihvatiPrijavu(id) {
  if (KORISTI_MOCK) {
    await pricekaj();
    const prijava = pronadiMockPrijavu(id);
    prijava.provjerena = true;
    return { ...prijava };
  }
  return posaljiZahtjev('PATCH', '/prijave/' + id, { provjerena: true });
}


export async function odbaciPrijavu(id) {
  if (KORISTI_MOCK) {
    await pricekaj();
    const prijava = pronadiMockPrijavu(id);
    prijava.status = 'ODBACENO';
    prijava.provjerena = true;
    return { ...prijava };
  }
  return posaljiZahtjev('PATCH', '/prijave/' + id, { status: 'ODBACENO' });
}


export async function posaljiEkoUdrugama(id) {
  if (KORISTI_MOCK) {
    await pricekaj();
    const prijava = pronadiMockPrijavu(id);
    if (!prijava.provjerena) {
      throw new Error('Prijavu prvo treba prihvatiti.');
    }
    prijava.nacinSanacije = 'UDRUGA';
    return { ...prijava };
  }
  return posaljiZahtjev('PATCH', '/prijave/' + id, { nacinSanacije: 'UDRUGA' });
}


export async function posaljiNaSluzbenuSanaciju(id) {
  if (KORISTI_MOCK) {
    await pricekaj();
    const prijava = pronadiMockPrijavu(id);
    if (!prijava.provjerena) {
      throw new Error('Prijavu prvo treba prihvatiti.');
    }
    if (prijava.status !== 'PRIJAVLJENO') {
      throw new Error('Prijava je već u akciji čišćenja ili riješena.');
    }
    prijava.status = 'SLUZBENA_SANACIJA';
    prijava.nacinSanacije = 'SLUZBENA';
    return { ...prijava };
  }
  return posaljiZahtjev('PATCH', '/prijave/' + id, { nacinSanacije: 'SLUZBENA' });
}

export async function promijeniKategoriju(id, novaKategorija) {
  if (KORISTI_MOCK) {
    await pricekaj();
    const prijava = pronadiMockPrijavu(id);
    prijava.kategorija = novaKategorija;
    return { ...prijava };
  }
  return posaljiZahtjev('PATCH', '/prijave/' + id, { kategorija: novaKategorija });
}
