package hr.fer.ecosentry.repository;

import hr.fer.ecosentry.model.Korisnik;
import hr.fer.ecosentry.model.Uloga;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest(properties = {"spring.flyway.enabled=false", "spring.jpa.hibernate.ddl-auto=create-drop"})
class KorisnikRepositoryTest {
    @Autowired private KorisnikRepository repository;

    @Test
    void pronalaziKorisnikaPoEmailu() {
        repository.saveAndFlush(new Korisnik("Ana", "Anić", "ana@example.com", Uloga.GRADANIN));
        var pronadeni = repository.findByEmail("ana@example.com");
        assertTrue(pronadeni.isPresent());
        assertEquals("Ana", pronadeni.get().getIme());
        assertEquals(Uloga.GRADANIN, pronadeni.get().getUloga());
    }

    @Test
    void vracaPrazanOptionalZaNepostojeciEmail() {
        assertTrue(repository.findByEmail("nepostoji@example.com").isEmpty());
    }
}
