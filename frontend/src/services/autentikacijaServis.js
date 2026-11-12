// Prijava i odjava preko Google OAuth-a

export const API_ADRESA = import.meta.env.VITE_API_URL || '';

//vraca prijavljenog korisnika ili null
export async function dohvatiPrijavljenogKorisnika() {
  const odgovor = await fetch(API_ADRESA + '/api/me', {
    credentials: 'include',
  });

  if (odgovor.status === 401) {
    return null;
  }
  if (!odgovor.ok) {
    throw new Error('Provjera prijave nije uspjela (' + odgovor.status + ').');
  }
  return odgovor.json();
}

//salje na Google prijavu
export function prijaviSeGoogleom() {
  window.location.href = API_ADRESA + '/api/auth/google';
}


function procitajXsrfToken() {
  const kolacici = document.cookie.split('; ');
  for (let i = 0; i < kolacici.length; i++) {
    if (kolacici[i].startsWith('XSRF-TOKEN=')) {
      return decodeURIComponent(kolacici[i].substring('XSRF-TOKEN='.length));
    }
  }
  return null;
}

export async function odjaviSe() {
  const zaglavlja = {};
  const xsrfToken = procitajXsrfToken();
  if (xsrfToken !== null) {
    zaglavlja['X-XSRF-TOKEN'] = xsrfToken;
  }

  const odgovor = await fetch(API_ADRESA + '/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
    headers: zaglavlja,
  });

  if (!odgovor.ok) {
    throw new Error('Odjava nije uspjela (' + odgovor.status + ').');
  }
}

export function normalizirajUlogu(uloga) {
  if (!uloga) {
    return null;
  }
  const velikimSlovima = uloga.toUpperCase();
  if (velikimSlovima === 'GRADANIN') {
    return 'GRADANIN';
  } else if (velikimSlovima === 'UDRUGA') {
    return 'UDRUGA';
  } else if (velikimSlovima === 'REDAR') {
    return 'REDAR';
  }
  return null;
}
