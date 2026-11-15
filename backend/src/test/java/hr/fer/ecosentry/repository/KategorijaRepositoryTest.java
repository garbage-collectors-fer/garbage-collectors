package hr.fer.ecosentry.repository;

import hr.fer.ecosentry.model.Kategorija;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest(properties = {"spring.flyway.enabled=false", "spring.jpa.hibernate.ddl-auto=create-drop"})
class KategorijaRepositoryTest {
    @Autowired private KategorijaRepository repository;

    @Test
    void pronalaziKategorijuPoNazivu() {
        repository.saveAndFlush(new Kategorija("Plastika"));
        assertEquals("Plastika", repository.findByNaziv("Plastika").orElseThrow().getNaziv());
        assertTrue(repository.findByNaziv("Nepoznata").isEmpty());
    }

    @Test
    void vracaSveKategorijeSortiranePoNazivu() {
        repository.save(new Kategorija("Staklo"));
        repository.save(new Kategorija("Biootpad"));
        repository.save(new Kategorija("Papir"));
        repository.flush();
        assertEquals(java.util.List.of("Biootpad", "Papir", "Staklo"),
                repository.findAllByOrderByNazivAsc().stream().map(Kategorija::getNaziv).toList());
    }
}
