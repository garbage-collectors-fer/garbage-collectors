package hr.fer.ecosentry.service;

import hr.fer.ecosentry.dto.PrijavaDto;
import hr.fer.ecosentry.model.NacinSanacije;
import hr.fer.ecosentry.model.StatusPrijave;
import hr.fer.ecosentry.repository.PrijavaRepository;
import org.springframework.stereotype.Service;


import java.util.List;

@Service
public class PrijavaService  {
    private static final List<StatusPrijave> SKRIVENI_STATUSI = List.of(StatusPrijave.ODBACENO, StatusPrijave.SLUZBENA_SANACIJA);

    private final PrijavaRepository prijavaRepository;

    public PrijavaService(PrijavaRepository prijavaRepository){
        this.prijavaRepository = prijavaRepository;
    }

    public List<PrijavaDto> dohvatiVidljive(StatusPrijave status, Boolean provjerena, boolean jeUdruga) {
        return prijavaRepository.findByStatusNotInOrderByDatumDesc(SKRIVENI_STATUSI)
                .stream()
                .filter(p -> !jeUdruga || p.getNacinSanacije() == NacinSanacije.UDRUGA)
                .filter(p -> status == null || p.getStatus() == status)
                .filter(p -> provjerena == null || p.isProvjerena() == provjerena)
                .map(PrijavaDto::iz)
                .toList();
    }

}


