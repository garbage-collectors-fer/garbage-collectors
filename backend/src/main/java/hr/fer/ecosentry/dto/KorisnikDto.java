package hr.fer.ecosentry.dto;

import hr.fer.ecosentry.model.Korisnik;
import hr.fer.ecosentry.model.Uloga;


public record KorisnikDto(Long id, String ime, String email, Uloga uloga, boolean blokiran, String razlogBlokade) {
    public static KorisnikDto iz(Korisnik k) {
        return new KorisnikDto(
            k.getId(),
            k.getIme(),
            k.getEmail(),
            k.getUloga(),
            k.isBlokiran(),
            k.getRazlogBlokade());
    }
}

