package hr.fer.ecosentry.model;

import jakarta.persistence.*;

@Entity
public class Korisnik {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String ime;

    @Column(nullable = false, unique = true)    // Google email je ono po čemu prepoznajemo korisnika
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Uloga uloga = Uloga.GRADANIN;

    @Column(nullable = false)
    private boolean blokiran = false;

    private String razlogBlokade;

    private String nazivUdruge;     // samo za ulogu UDRUGA

    public Korisnik() {
    }

    public Korisnik(String ime, String email, Uloga uloga) {
        this.ime = ime;
        this.email = email;
        this.uloga = uloga;
    }

    public Long getId() {
        return id;
    }

    public String getIme() {
        return ime;
    }

    public void setIme(String ime) {
        this.ime = ime;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Uloga getUloga() {
        return uloga;
    }

    public void setUloga(Uloga uloga) {
        this.uloga = uloga;
    }

    public boolean isBlokiran() {
        return blokiran;
    }

    public void setBlokiran(boolean blokiran) {
        this.blokiran = blokiran;
    }

    public String getRazlogBlokade() {
        return razlogBlokade;
    }

    public void setRazlogBlokade(String razlogBlokade) {
        this.razlogBlokade = razlogBlokade;
    }

    public String getNazivUdruge() {
        return nazivUdruge;
    }

    public void setNazivUdruge(String nazivUdruge) {
        this.nazivUdruge = nazivUdruge;
    }
}
