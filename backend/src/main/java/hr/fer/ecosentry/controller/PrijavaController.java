package hr.fer.ecosentry.controller;
import hr.fer.ecosentry.dto.PrijavaDto;
import hr.fer.ecosentry.model.StatusPrijave;
import hr.fer.ecosentry.repository.PrijavaRepository;
import hr.fer.ecosentry.service.PrijavaService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
@RestController
@RequestMapping("/api/prijave")
public class PrijavaController {
    private static final List<StatusPrijave> SKRIVENI_STATUSI = List.of(StatusPrijave.ODBACENO, StatusPrijave.SLUZBENA_SANACIJA);

    private final PrijavaRepository prijavaRepository;
    private final PrijavaService prijavaService;

    public PrijavaController(PrijavaRepository prijavaRepository, PrijavaService prijavaService) {
        this.prijavaRepository = prijavaRepository;
        this.prijavaService = prijavaService;
    }

    @GetMapping
    public List<PrijavaDto> dohvatiSve(
            @RequestParam(required = false) StatusPrijave status,
            @RequestParam(required = false) Boolean provjerena,   // potrebna su tri stanja, T, F i null
            Authentication authentication) {

        boolean jeUdruga = authentication.getAuthorities().stream()         // udruge mogu samo vidjeti prijave čija je sanacija za udruge
                .anyMatch(a  -> a.getAuthority().equals("ROLE_UDRUGA"));

        return prijavaService.dohvatiVidljive(status, provjerena, jeUdruga);
    }
}
