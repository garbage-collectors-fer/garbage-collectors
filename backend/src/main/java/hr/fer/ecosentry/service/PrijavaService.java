package hr.fer.ecosentry.service;

import hr.fer.ecosentry.model.KategorijaOtpada;
import hr.fer.ecosentry.model.Korisnik;
import hr.fer.ecosentry.model.Prijava;
import hr.fer.ecosentry.repository.KorisnikRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import hr.fer.ecosentry.dto.PrijavaDto;
import hr.fer.ecosentry.model.NacinSanacije;
import hr.fer.ecosentry.model.StatusPrijave;
import hr.fer.ecosentry.repository.PrijavaRepository;
import org.springframework.stereotype.Service;
import hr.fer.ecosentry.model.Uloga;

import java.util.List;

@Service
public class PrijavaService  {
    private static final List<StatusPrijave> SKRIVENI_STATUSI = List.of(StatusPrijave.ODBACENO, StatusPrijave.SLUZBENA_SANACIJA);

    private final PrijavaRepository prijavaRepository;
    private final KorisnikRepository korisnikRepository;
    private final SlikaService slikaService;

    public PrijavaService(PrijavaRepository prijavaRepository, KorisnikRepository korisnikRepository, SlikaService slikaService){
        this.prijavaRepository = prijavaRepository;
        this.korisnikRepository = korisnikRepository;
        this.slikaService = slikaService;
    }

    public List<PrijavaDto> dohvatiVidljive(String email, StatusPrijave status, Boolean provjerena) {
        Korisnik gledatelj = trenutniKorisnik(email);
        boolean jeUdruga = gledatelj.getUloga() == Uloga.UDRUGA;

        return prijavaRepository.findByStatusNotInOrderByDatumDesc(SKRIVENI_STATUSI)
                .stream()
                .filter(p -> !jeUdruga || p.getNacinSanacije() == NacinSanacije.UDRUGA)
                .filter(p -> status == null || p.getStatus() == status)
                .filter(p -> provjerena == null || p.isProvjerena() == provjerena)
                .map(p -> PrijavaDto.iz(p, smijeVidjetiPrijavitelja(p, gledatelj)))
                .toList();
    }

    private Korisnik trenutniKorisnik(String email){
        return korisnikRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Korisnik nije prijavljen"));
    }

    private boolean smijeVidjetiPrijavitelja(Prijava p, Korisnik gledatelj) {
        if(gledatelj.getUloga() == Uloga.REDAR) {
            return true;
        }
        return p.getPrijavitelj() != null && p.getPrijavitelj().getId().equals(gledatelj.getId());
    }

    public PrijavaDto dohvati(Long id, String email) {
        Korisnik gledatelj = trenutniKorisnik(email);

        Prijava p = prijavaRepository.findById(id)
                .filter(pr -> smijeVidjetiPrijavu(pr, gledatelj))      // nevidljiva = kao da ne postoji
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Prijava ne postoji"));

        return PrijavaDto.iz(p, smijeVidjetiPrijavitelja(p, gledatelj));
    }

    public List<PrijavaDto> dohvatiMoje(String email) {
        Korisnik gledatelj = trenutniKorisnik(email);

        return prijavaRepository.findByPrijaviteljOrderByDatumDesc(gledatelj)
                .stream()                                   // moze vidjeti odbacene i sluzbene sanacije
                .map(p -> PrijavaDto.iz(p, true))     // sve su njegove, pa uvijek vidi prijavitelja
                .toList();
    }


    // tko smije otvoriti detalje jedne prijave
    private boolean smijeVidjetiPrijavu(Prijava p, Korisnik gledatelj) {
        if (gledatelj.getUloga() == Uloga.REDAR) {
            return true;                                    // redar vidi sve, i odbačene
        }
        if (p.getPrijavitelj() != null && p.getPrijavitelj().getId().equals(gledatelj.getId())) {
            return true;                                    // svoje prijave korisnik uvijek vidi
        }
        if (SKRIVENI_STATUSI.contains(p.getStatus())) {
            return false;                                   // odbačene i službene ostali ne vide
        }
        if (gledatelj.getUloga() == Uloga.UDRUGA) {
            return p.getNacinSanacije() == NacinSanacije.UDRUGA;
        }
        return true;
    }

    public PrijavaDto stvori(String email, MultipartFile slika, double lat, double lng, KategorijaOtpada kategorija) {
        Korisnik prijavitelj = trenutniKorisnik(email);

        if (prijavitelj.isBlokiran()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Vaš račun je blokiran");
        }

        if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Neispravna lokacija");
        }

        // slika se sprema tek kad je sve ostalo provjereno, da ne ostanu datoteke od odbijenih zahtjeva
        String slikaUrl = slikaService.spremi(slika);

        Prijava prijava = new Prijava();
        prijava.setLat(lat);
        prijava.setLng(lng);
        prijava.setKategorija(kategorija);
        prijava.setSlikaUrl(slikaUrl);
        prijava.setPrijavitelj(prijavitelj);
        // status (PRIJAVLJENO), provjerena (false) i datum postavljaju se sami u entitetu

        return PrijavaDto.iz(prijavaRepository.save(prijava), true);
    }

}


