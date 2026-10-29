export default function Gradjanin() {
  return (
    <>
      <div className="page-heading">
        <p className="eyebrow">Pregled uloge</p>
        <h1>Građanin</h1>
        <p>Prijavljuje divlja odlagališta, prati rješavanje svojih prijava i sudjeluje u akcijama čišćenja.</p>
      </div>

      <div className="feature-grid">
        <section className="feature-card">
          <h2>Prijava u sustav</h2>
          <p>Prijaviti se pomoću Google računa i pristupiti funkcionalnostima građanina.</p>
        </section>
        <section className="feature-card">
          <h2>Prijava odlagališta</h2>
          <ul>
            <li>Unijeti lokaciju, fotografiju i kategoriju otpada.</li>
            <li>Preuzeti lokaciju putem GPS-a ili je unijeti ručno.</li>
          </ul>
        </section>
        <section className="feature-card">
          <h2>Pregled karte</h2>
          <p>Pregledavati odlagališta i detalje prijava: fotografiju, kategoriju, adresu ili koordinate, status i datum.</p>
        </section>
        <section className="feature-card">
          <h2>Moje prijave</h2>
          <ul>
            <li>Pratiti statuse vlastitih prijava i povijest promjena.</li>
            <li>Čitati obavijesti o promjenama unutar aplikacije.</li>
          </ul>
        </section>
        <section className="feature-card">
          <h2>Akcije čišćenja</h2>
          <ul>
            <li>Pregledavati termine, mjesta okupljanja, popunjenost i vremensku prognozu.</li>
            <li>Prijaviti se kao volonter ili odjaviti ako više ne može sudjelovati.</li>
          </ul>
        </section>
        <section className="feature-card">
          <h2>Kalendar i dolazak</h2>
          <ul>
            <li>Dodati akciju u Google kalendar s lokacijom, uputama i podsjetnikom dva sata prije početka.</li>
            <li>Prikazati mjesto okupljanja i rutu dolaska ako je dopušten pristup lokaciji.</li>
          </ul>
        </section>
      </div>

      <section className="rules-panel">
        <h2>Važna pravila</h2>
        <ul>
          <li>Prijava mora sadržavati lokaciju, kategoriju i JPG ili PNG fotografiju do 10 MB.</li>
          <li>Blokirani korisnik ne može podnositi nove prijave ni prijavljivati se na akcije.</li>
          <li>Prijava na popunjenu akciju nije dopuštena.</li>
          <li>Nedostupna prognoza ili odbijen pristup Google kalendaru ne sprečavaju prijavu na akciju.</li>
        </ul>
      </section>
    </>
  );
}
