package hr.fer.ecosentry.model;
import jakarta.persistence.*;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Entity
public class Prijava {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Double lat;

    @Column(nullable = false)

    private Double lng;

    private String adresa;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private KategorijaOtpada kategorija;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusPrijave status = StatusPrijave.PRIJAVLJENO;

    @Column(nullable = false)
    private boolean provjerena = false;

    @Enumerated(EnumType.STRING)
    private NacinSanacije nacinSanacije;

    @Column(nullable = false)
    private String slikaUrl;

    private String slikaSanacijeUrl;

    @Column(nullable = false)
    private Instant datum;          // Datumi su u ISO 8601 formatu u UTC-u, npr. "2026-10-20T14:32:00Z"

    public Prijava() {
    }

    @PrePersist
    void prijeSpremanja() {
        if (datum == null) {
            datum = Instant.now().truncatedTo(ChronoUnit.SECONDS);  // "2026-10-20T14:32:00Z" zadovoljen ovaj format
        }
    }

    public Long getId() {
        return id;
    }


    public Double getLat() {
        return lat;
    }

    public void setLat(Double lat) {
        this.lat = lat;
    }

    public Double getLng() {
        return lng;
    }

    public void setLng(Double lng) {
        this.lng = lng;
    }

    public String getAdresa() {
        return adresa;
    }

    public void setAdresa(String adresa) {
        this.adresa = adresa;
    }

    public KategorijaOtpada getKategorija() {
        return kategorija;
    }

    public void setKategorija(KategorijaOtpada kategorija) {
        this.kategorija = kategorija;
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

    public NacinSanacije getNacinSanacije() {
        return nacinSanacije;
    }

    public void setNacinSanacije(NacinSanacije nacinSanacije) {
        this.nacinSanacije = nacinSanacije;
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
