package hr.fer.ecosentry.repository;

import hr.fer.ecosentry.model.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest(properties = {"spring.flyway.enabled=false", "spring.jpa.hibernate.ddl-auto=create-drop"})
class PrijavaRepositoryTest {
    @Autowired private PrijavaRepository prijavaRepository;
    @Autowired private KorisnikRepository korisnikRepository;
    @Autowired private KategorijaRepository kategorijaRepository;

    @Test
    void pronalaziPrijaveOdredenogPrijavitelja() {
        var korisnik = korisnikRepository.saveAndFlush(
                new Korisnik("Ivan", "Ivić", "ivan@example.com", Uloga.GRADANIN));
        var kategorija = kategorijaRepository.saveAndFlush(new Kategorija("Glomazni otpad"));
        var prijava = novaPrijava(korisnik, kategorija, StatusPrijave.PRIJAVLJENO);
        prijavaRepository.saveAndFlush(prijava);

        var rezultat = prijavaRepository.findByPrijaviteljOrderByDatumDesc(korisnik);
        assertEquals(1, rezultat.size());
        assertEquals("ivan@example.com", rezultat.get(0).getPrijavitelj().getEmail());
    }

    @Test
    void upitZaStatusNotInIzostavljaZadaneStatuse() {
        var korisnik = korisnikRepository.saveAndFlush(
                new Korisnik("Mia", "Milić", "mia@example.com", Uloga.GRADANIN));
        var kategorija = kategorijaRepository.saveAndFlush(new Kategorija("Elektronički otpad"));
        prijavaRepository.save(novaPrijava(korisnik, kategorija, StatusPrijave.PRIJAVLJENO));
        prijavaRepository.save(novaPrijava(korisnik, kategorija, StatusPrijave.ODBACENO));
        prijavaRepository.flush();

        var rezultat = prijavaRepository.findByStatusNotInOrderByDatumDesc(
                List.of(StatusPrijave.ODBACENO, StatusPrijave.SLUZBENA_SANACIJA));
        assertEquals(1, rezultat.size());
        assertEquals(StatusPrijave.PRIJAVLJENO, rezultat.get(0).getStatus());
    }

    private Prijava novaPrijava(Korisnik korisnik, Kategorija kategorija, StatusPrijave status) {
        var prijava = new Prijava();
        prijava.setPrijavitelj(korisnik);
        prijava.setKategorija(kategorija);
        prijava.setLat(45.8);
        prijava.setLng(15.9);
        prijava.setSlikaUrl("/uploads/test.jpg");
        prijava.setStatus(status);
        return prijava;
    }
}
