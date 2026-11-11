
import { prijave as mockPrijave } from './mockPodaci.js';

const KORISTI_MOCK = true;


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
  if (tijelo !== undefined) {
    postavke.headers['Content-Type'] = 'application/json';
    postavke.body = JSON.stringify(tijelo);
  }

  const odgovor = await fetch('/api' + putanja, postavke);

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
    return {
      id: 500 + id,
      broj: 'EKO-2026-' + id,
      prijavaId: id,
      datum: new Date().toISOString(),
      adresa: prijava.adresa,
      kategorija: prijava.kategorija,
      slikaUrl: prijava.slikaUrl,
    };
  }
  return posaljiZahtjev('POST', '/prijave/' + id + '/nalog');
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
