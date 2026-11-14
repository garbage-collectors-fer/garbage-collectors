package hr.fer.ecosentry.repository;

import  hr.fer.ecosentry.model.Prijava;
import hr.fer.ecosentry.model.StatusPrijave;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface PrijavaRepository extends JpaRepository<Prijava, Long> {
    List<Prijava> findByStatusNotInOrderByDatumDesc(Collection<StatusPrijave> statusi);
}