package hr.fer.ecosentry.model;

import jakarta.persistence.*;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

/**
 * Tablica KORISNIK (V1__init.sql). Shemu radi flyway, hibernate je samo provjerava
 * (ddl-auto=validate), pa se imena stupaca moraju poklapati s bazom.
 */
@Entity
@Table(name = "korisnik")
public class Korisnik {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_korisnik")
    private Long id;

    /** Pružatelj identiteta; zasad uvijek google, prilagodio dizajnu baze, takoder je jednostavnije za backend */
    @Column(name = "oauth_provider", nullable = false)
    private String oauthProvider = "google";

    /** Googleov sub(stalni ID korisnika). NULL dok se unaprijed dodan redar ne prijavi prvi put. */
    @Column(name = "id_oauth")
    private String idOauth;

    /** Google email; jedinstven. */
    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String ime;

    @Column(nullable = false)
    private String prezime = "";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Uloga uloga = Uloga.GRADANIN;

    @Enumerated(EnumType.STRING)
    @Column(name = "status_racuna", nullable = false)
    private StatusRacuna statusRacuna = StatusRacuna.AKTIVAN;

    /** Samo za ulogu UDRUGA (baza to provjerava: ck_korisnik_udruga). */
    @Column(name = "organizacija_naziv")
    private String nazivUdruge;

    /** Obavezan kad je status BLOKIRAN (baza to provjerava: ck_korisnik_blokada). */
    @Column(name = "razlog_blokade")
    private String razlogBlokade;

    @Column(name = "datum_registracije", nullable = false, updatable = false)
    private Instant datumRegistracije;

    public Korisnik() {
    }

    public Korisnik(String ime, String prezime, String email, Uloga uloga) {
        this.ime = ime;
        this.prezime = prezime;
        this.email = email;
        this.uloga = uloga;
    }

    /** Stari konstruktor, zadržan da postojeći kod ne pukne. Prezime ostaje prazno. */
    public Korisnik(String ime, String email, Uloga uloga) {
        this(ime, "", email, uloga);
    }

    @PrePersist
    void prijeSpremanja() {
        if (datumRegistracije == null) {
            datumRegistracije = Instant.now().truncatedTo(ChronoUnit.SECONDS);
        }
    }

    // blokiranje

    public boolean isBlokiran() {
        return statusRacuna == StatusRacuna.BLOKIRAN;
    }

    /** Blokira korisnika. Razlog je obavezan. */
    public void blokiraj(String razlog) {
        this.razlogBlokade = razlog;
        this.statusRacuna = StatusRacuna.BLOKIRAN;
    }

    public void odblokiraj() {
        this.statusRacuna = StatusRacuna.AKTIVAN;
        this.razlogBlokade = null;
    }

    /**
     * Zadržano zbog postojećeg koda. Prije setBlokiran(true) mora biti postavljen
     * razlogBlokade, inače bi baza odbila spremanje. Bolje koristiti blokiraj(razlog).
     */
    public void setBlokiran(boolean blokiran) {
        if (blokiran) {
            this.statusRacuna = StatusRacuna.BLOKIRAN;
        } else {
            odblokiraj();
        }
    }

    // ---- getteri i setteri ----

    public Long getId() {
        return id;
    }

    public String getOauthProvider() {
        return oauthProvider;
    }

    public void setOauthProvider(String oauthProvider) {
        this.oauthProvider = oauthProvider;
    }

    public String getIdOauth() {
        return idOauth;
    }

    public void setIdOauth(String idOauth) {
        this.idOauth = idOauth;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getIme() {
        return ime;
    }

    public void setIme(String ime) {
        this.ime = ime;
    }

    public String getPrezime() {
        return prezime;
    }

    public void setPrezime(String prezime) {
        this.prezime = prezime;
    }

    public Uloga getUloga() {
        return uloga;
    }

    public void setUloga(Uloga uloga) {
        this.uloga = uloga;
    }

    public StatusRacuna getStatusRacuna() {
        return statusRacuna;
    }

    public void setStatusRacuna(StatusRacuna statusRacuna) {
        this.statusRacuna = statusRacuna;
    }

    public String getNazivUdruge() {
        return nazivUdruge;
    }

    public void setNazivUdruge(String nazivUdruge) {
        this.nazivUdruge = nazivUdruge;
    }

    public String getRazlogBlokade() {
        return razlogBlokade;
    }

    public void setRazlogBlokade(String razlogBlokade) {
        this.razlogBlokade = razlogBlokade;
    }

    public Instant getDatumRegistracije() {
        return datumRegistracije;
    }
}