package hr.fer.ecosentry.model;

import jakarta.persistence.*;

/**
 * Tablica KATEGORIJA: šifrarnik vrsta otpada,početne vrijednosti upisuje V2__seed.sql.
 * Zamjenjuje stari enum KategorijaOtpada.
 */
@Entity
@Table(name = "kategorija")
public class Kategorija {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_kategorija")
    private Long id;

    @Column(name = "kategorija_naziv", nullable = false, unique = true)
    private String naziv;

    public Kategorija() {
    }

    public Kategorija(String naziv) {
        this.naziv = naziv;
    }

    public Long getId() {
        return id;
    }

    public String getNaziv() {
        return naziv;
    }

    public void setNaziv(String naziv) {
        this.naziv = naziv;
    }
}
