package hr.fer.ecosentry.dto;

import hr.fer.ecosentry.model.KategorijaOtpada;
import hr.fer.ecosentry.model.NacinSanacije;
import hr.fer.ecosentry.model.Prijava;
import hr.fer.ecosentry.model.StatusPrijave;

import java.time.Instant;

public record PrijavaDto (
                        Long id,
                        Double lat,
                        Double lng,
                        String adresa,
                        KategorijaOtpada kategorija,
                        StatusPrijave status,
                        boolean provjerena,
                        NacinSanacije nacinSanacije,
                        String slikaUrl,
                        String slikaSanacijeUrl,
                        Instant datum,
                        PrijaviteljDto prijavitelj,
                        Long akcijaId) {
    public record PrijaviteljDto(Long id, String ime) {
    }

    public static PrijavaDto iz(Prijava p, boolean prikaziPrijavitelja) {    // iz entitya stvara record
        return new PrijavaDto(p.getId(),
                p.getLat(),
                p.getLng(),
                p.getAdresa(),
                p.getKategorija(),
                p.getStatus(),
                p.isProvjerena(),
                p.getNacinSanacije(),
                p.getSlikaUrl(),
                p.getSlikaSanacijeUrl(),
                p.getDatum(),
                (!prikaziPrijavitelja || p.getPrijavitelj() == null) ? null : new PrijaviteljDto(p.getPrijavitelj().getId(), p.getPrijavitelj().getIme()),
                null
        );
    }

}
