
//kategorija s backenda je objekt { id, naziv }
export function nazivKategorije(kategorija) {
  if (!kategorija) {
    return '-';
  }
  return kategorija.naziv;
}

export function nazivStatusa(status) {
  if (status === 'PRIJAVLJENO') {
    return 'Prijavljeno';
  } else if (status === 'AKCIJA_U_TIJEKU') {
    return 'Akcija u tijeku';
  } else if (status === 'SLUZBENA_SANACIJA') {
    return 'Službena sanacija';
  } else if (status === 'OCISCENO') {
    return 'Očišćeno';
  } else if (status === 'ODBACENO') {
    return 'Odbačeno';
  }
  return status;
}

export function nazivNacinaSanacije(nacinSanacije) {
  if (nacinSanacije === 'UDRUGA') {
    return 'Eko-udruga';
  } else if (nacinSanacije === 'SLUZBENA') {
    return 'Službena sanacija';
  }
  return 'Nije odlučeno';
}


export function bojaStatusa(status) {
  if (status === 'PRIJAVLJENO') {
    return '#d32f2f';
  } else if (status === 'AKCIJA_U_TIJEKU' || status === 'SLUZBENA_SANACIJA') {
    return '#f9a825';
  } else if (status === 'OCISCENO') {
    return '#2e7d32';
  }
  return '#757575';
}

export function formatirajDatum(datumTekst) {
  const datum = new Date(datumTekst);
  return datum.toLocaleDateString('hr-HR') + ' ' + datum.toLocaleTimeString('hr-HR', { hour: '2-digit', minute: '2-digit' });
}
