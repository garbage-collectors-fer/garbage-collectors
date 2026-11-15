package hr.fer.ecosentry.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import hr.fer.ecosentry.dto.PrijavaDto;
import hr.fer.ecosentry.model.StatusPrijave;
import hr.fer.ecosentry.repository.PrijavaRepository;
import hr.fer.ecosentry.service.PrijavaService;
import hr.fer.ecosentry.dto.PrijavaIzmjenaDto;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;

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
            @RequestParam(required = false) Boolean provjerena,   //potrebna su tri stanja, T, F i null
            @AuthenticationPrincipal OidcUser user) {

        return prijavaService.dohvatiVidljive(user.getEmail(), status, provjerena);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('GRADANIN')")        //samo građanin može prijaviti otpad
    public PrijavaDto stvori(
            @RequestParam MultipartFile slika,
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam("kategorija") Long kategorijaId,   //ID iz tablice kategorija,
            @AuthenticationPrincipal OidcUser user) {

        return prijavaService.stvori(user.getEmail(), slika, lat, lng, kategorijaId);
    }

    @GetMapping("/{id}")
    public PrijavaDto dohvatiJednu(@PathVariable Long id, @AuthenticationPrincipal OidcUser user) {
        return prijavaService.dohvati(id, user.getEmail());
    }

    @GetMapping("/moje")
    @PreAuthorize("hasRole('GRADANIN')")        //samo građanin ima svoje prijave
    public List<PrijavaDto> dohvatiMoje(@AuthenticationPrincipal OidcUser user) {
        return prijavaService.dohvatiMoje(user.getEmail());
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('REDAR')")           //samo redar odlučuje o prijavama
    public PrijavaDto izmijeni(@PathVariable Long id, @RequestBody PrijavaIzmjenaDto izmjena) {
        return prijavaService.izmijeni(id, izmjena);
    }

}
