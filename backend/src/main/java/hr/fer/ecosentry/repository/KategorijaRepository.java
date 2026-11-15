package hr.fer.ecosentry.repository;

import hr.fer.ecosentry.model.Kategorija;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface KategorijaRepository extends JpaRepository<Kategorija, Long> {
    List<Kategorija> findAllByOrderByNazivAsc();          // za padajući izbornik na frontendu
    Optional<Kategorija> findByNaziv(String naziv);
}
