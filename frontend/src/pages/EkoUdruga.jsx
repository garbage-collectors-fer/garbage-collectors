export default function EkoUdruga() {
  return (
    <>
      <div className="page-heading">
        <p className="eyebrow">Pregled uloge</p>
        <h1>Eko-udruga</h1>
        <p>Organizira akcije čišćenja, upravlja njihovim terminima i šalje dokaze o sanaciji komunalnom redaru.</p>
      </div>

      <div className="feature-grid">
        <section className="feature-card">
          <h2>Račun udruge</h2>
          <ul>
            <li>Prijaviti se pomoću Google računa.</li>
            <li>Zatražiti odobrenje udruge i vidjeti status zahtjeva.</li>
          </ul>
        </section>
        <section className="feature-card">
          <h2>Odabir odlagališta</h2>
          <p>Pregledavati kartu prijava i pronaći provjerena odlagališta dostupna za čišćenje.</p>
        </section>
        <section className="feature-card">
          <h2>Nova akcija</h2>
          <ul>
            <li>Odabrati jednu ili više prijava za čišćenje.</li>
            <li>Unijeti naziv, opis, najveći broj volontera, datum, vrijeme i mjesto okupljanja.</li>
          </ul>
        </section>
        <section className="feature-card">
          <h2>Kalendar i volonteri</h2>
          <ul>
            <li>Pratiti akcije i broj prijavljenih volontera.</li>
            <li>Urediti ili otkazati buduću akciju uz potvrdu i obavijestiti volontere.</li>
            <li>Uskladiti termine s Google kalendarima udruge i volontera.</li>
          </ul>
        </section>
        <section className="feature-card">
          <h2>Prognoza i odgoda</h2>
          <p>Pregledavati vremensku prognozu i upozorenja na nevrijeme te po potrebi odgoditi akciju.</p>
        </section>
        <section className="feature-card">
          <h2>Potvrda sanacije</h2>
          <ul>
            <li>Nakon akcije učitati fotografiju očišćene lokacije i poslati redaru zahtjev za zatvaranje prijave.</li>
            <li>Vidjeti je li sanacija potvrđena ili je potreban novi dokaz.</li>
          </ul>
        </section>
      </div>

      <section className="rules-panel">
        <h2>Važna pravila</h2>
        <ul>
          <li>Udruga mora biti odobrena prije organiziranja akcija.</li>
          <li>Dostupne su samo provjerene prijave u statusu Prijavljeno, koje nisu u drugoj akciji ni u službenoj sanaciji.</li>
          <li>Termin mora biti u budućnosti, a kapacitet ne smije biti manji od broja već prijavljenih volontera.</li>
          <li>Kreiranje akcije mijenja status prijava u Akcija u tijeku. Otkazivanje ih vraća u status Prijavljeno.</li>
          <li>Slanje dokaza ne zatvara prijavu automatski: sanaciju mora potvrditi komunalni redar.</li>
        </ul>
      </section>
    </>
  );
}
