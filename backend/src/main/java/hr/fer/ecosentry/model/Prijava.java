package hr.fer.ecosentry.model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

/**
 * Tablica PRIJAVA (V1__init.sql). Imena java polja i getteri/setteri ostali su isti
 * kao prije, mijenjala su se samo imena stupaca, da postojeći radi.
 */
@Entity
@Table(name = "prijava")
public class Prijava {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_prijava")
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_korisnik", nullable = false)
    private Korisnik prijavitelj;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_kategorija", nullable = false)
    private Kategorija kategorija;

    /** NUMERIC(9,6) u bazi; preciznost oko 10cm, getteri ce i dalje vracat double */
    @Column(name = "latituda", nullable = false, precision = 9, scale = 6)
    private BigDecimal lat;

    @Column(name = "longituda", nullable = false, precision = 9, scale = 6)
    private BigDecimal lng;

    private String adresa;          // iz geokodiranja, nije obavezna(dogovorno)

    private String kvart;           // za statistiku po kvartovima

    private String opis;

    @Column(name = "volumen_estm")
    private String volumenEstm;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusPrijave status = StatusPrijave.PRIJAVLJENO;

    @Column(nullable = false)
    private boolean provjerena = false;

    /** Redar odlucuje ide li prijava eko-udrugama ili na sluzbenu sanaciju; NULL dok ne odluci. */
    @Enumerated(EnumType.STRING)
    @Column(name = "nacin_sanacije")
    private NacinSanacije nacinSanacije;

    /** Broj službenog naloga; obavezan za status SLUZBENA_SANACIJA. */
    @Column(name = "nalog_broj", unique = true)
    private String nalogBroj;

    @Column(name = "url_fotografija", nullable = false)
    private String slikaUrl;

    /** Fotografija kad redar sam zatvara prijavu (prema F-019). */
    @Column(name = "url_foto_sanacija")
    private String slikaSanacijeUrl;

    @Column(name = "datum_kreiranja", nullable = false, updatable = false)
    private Instant datum;          // ISO 8601 u UTCu

    public Prijava() {
    }

    @PrePersist
    void prijeSpremanja() {
        if (datum == null) {
            datum = Instant.now().truncatedTo(ChronoUnit.SECONDS);
        }
    }

    //getteri  i setteri

    public NacinSanacije getNacinSanacije() {
        return nacinSanacije;
    }

    public void setNacinSanacije(NacinSanacije nacinSanacije) {
        this.nacinSanacije = nacinSanacije;
    }

    public Long getId() {
        return id;
    }

    public Korisnik getPrijavitelj() {
        return prijavitelj;
    }

    public void setPrijavitelj(Korisnik prijavitelj) {
        this.prijavitelj = prijavitelj;
    }

    public Kategorija getKategorija() {
        return kategorija;
    }

    public void setKategorija(Kategorija kategorija) {
        this.kategorija = kategorija;
    }

    public Double getLat() {
        return lat == null ? null : lat.doubleValue();
    }

    public void setLat(Double lat) {
        this.lat = lat == null ? null : BigDecimal.valueOf(lat);
    }

    public Double getLng() {
        return lng == null ? null : lng.doubleValue();
    }

    public void setLng(Double lng) {
        this.lng = lng == null ? null : BigDecimal.valueOf(lng);
    }

    public String getAdresa() {
        return adresa;
    }

    public void setAdresa(String adresa) {
        this.adresa = adresa;
    }

    public String getKvart() {
        return kvart;
    }

    public void setKvart(String kvart) {
        this.kvart = kvart;
    }

    public String getOpis() {
        return opis;
    }

    public void setOpis(String opis) {
        this.opis = opis;
    }

    public String getVolumenEstm() {
        return volumenEstm;
    }

    public void setVolumenEstm(String volumenEstm) {
        this.volumenEstm = volumenEstm;
    }

    public StatusPrijave getStatus() {
        return status;
    }

    public void setStatus(StatusPrijave status) {
        this.status = status;
    }

    public boolean isProvjerena() {
        return provjerena;
    }

    public void setProvjerena(boolean provjerena) {
        this.provjerena = provjerena;
    }

    public String getNalogBroj() {
        return nalogBroj;
    }

    public void setNalogBroj(String nalogBroj) {
        this.nalogBroj = nalogBroj;
    }

    public String getSlikaUrl() {
        return slikaUrl;
    }

    public void setSlikaUrl(String slikaUrl) {
        this.slikaUrl = slikaUrl;
    }

    public String getSlikaSanacijeUrl() {
        return slikaSanacijeUrl;
    }

    public void setSlikaSanacijeUrl(String slikaSanacijeUrl) {
        this.slikaSanacijeUrl = slikaSanacijeUrl;
    }

    public Instant getDatum() {
        return datum;
    }

    public void setDatum(Instant datum) {
        this.datum = datum;
    }
}