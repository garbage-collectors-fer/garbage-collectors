package hr.fer.ecosentry.controller;

import hr.fer.ecosentry.model.KategorijaOtpada;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.multipart.MultipartFile;

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


    private final PrijavaService prijavaService;

    public PrijavaController( PrijavaService prijavaService) {

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

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('GRADANIN')")        // samo građanin može prijaviti otpad
    public PrijavaDto stvori(
            @RequestParam MultipartFile slika,
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam KategorijaOtpada kategorija,
            @AuthenticationPrincipal OidcUser user) {

        return prijavaService.stvori(user.getEmail(), slika, lat, lng, kategorija);
    }

}
