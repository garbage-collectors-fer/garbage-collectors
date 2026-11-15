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

    public List<PrijavaDto> dohvatiVidljive(StatusPrijave status, Boolean provjerena, boolean jeUdruga) {
        return prijavaRepository.findByStatusNotInOrderByDatumDesc(SKRIVENI_STATUSI)
                .stream()
                .filter(p -> !jeUdruga || p.getNacinSanacije() == NacinSanacije.UDRUGA)
                .filter(p -> status == null || p.getStatus() == status)
                .filter(p -> provjerena == null || p.isProvjerena() == provjerena)
                .map(PrijavaDto::iz)
                .toList();
    }


    public PrijavaDto stvori(String email, MultipartFile slika, double lat, double lng, KategorijaOtpada kategorija) {
        Korisnik prijavitelj = korisnikRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Korisnik nije prijavljen"));

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

        return PrijavaDto.iz(prijavaRepository.save(prijava));
    }

}


