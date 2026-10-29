export default function KomunalniRedar() {
  return (
    <>
      <div className="page-heading">
        <p className="eyebrow">Pregled uloge</p>
        <h1>Komunalni redar</h1>
        <p>Provjerava prijave, nadzire sanaciju odlagališta i upravlja korisnicima i pravima u sustavu.</p>
      </div>

      <div className="feature-grid">
        <section className="feature-card">
          <h2>Račun redara</h2>
          <ul>
            <li>Prijaviti se Google računom ili dodijeljenim korisničkim imenom i lozinkom.</li>
            <li>Promijeniti lozinku uz provjeru stare lozinke.</li>
          </ul>
        </section>
        <section className="feature-card">
          <h2>Provjera prijava</h2>
          <ul>
            <li>Pregledati fotografije, lokacije, kategorije i statuse novih prijava.</li>
            <li>Prihvatiti prijavu, ispraviti kategoriju ili odbaciti lažnu ili ponovljenu prijavu.</li>
          </ul>
        </section>
        <section className="feature-card">
          <h2>Službeni nalozi</h2>
          <p>Za opasan ili prevelik otpad izdati nalog s identifikatorom, lokacijom, adresom, kategorijom i fotografijama.</p>
        </section>
        <section className="feature-card">
          <h2>Potvrda sanacije</h2>
          <ul>
            <li>Pregledati dokaz udruge i prihvatiti ga ili odbiti.</li>
            <li>Samostalno zatvoriti prijavu uz fotografiju očišćene lokacije.</li>
          </ul>
        </section>
        <section className="feature-card">
          <h2>Korisnici i udruge</h2>
          <ul>
            <li>Blokirati korisnika uz navođenje razloga i kasnije ukloniti blokadu.</li>
            <li>Pregledati zahtjeve eko-udruga i odobriti njihove profile.</li>
          </ul>
        </section>
        <section className="feature-card">
          <h2>Karta i statistika</h2>
          <ul>
            <li>Pregledavati kartu svih prijava.</li>
            <li>Za odabrano razdoblje pratiti broj prijava po mjesecima i postotak riješenih prijava.</li>
          </ul>
        </section>
      </div>

      <section className="rules-panel">
        <h2>Važna pravila</h2>
        <ul>
          <li>Prihvaćena prijava postaje dostupna udrugama. Odbačena prijava nije vidljiva na karti.</li>
          <li>Nalog se izdaje samo za prihvaćenu prijavu koja nije u akciji čišćenja. Status postaje Službena sanacija.</li>
          <li>Potvrdom sanacije status postaje Očišćeno i prijavitelj dobiva obavijest.</li>
          <li>Ako je dokaz odbijen, status ostaje nepromijenjen, a udruga dobiva obavijest.</li>
          <li>Pregled statistike ne mijenja podatke u sustavu.</li>
        </ul>
      </section>
    </>
  );
}
