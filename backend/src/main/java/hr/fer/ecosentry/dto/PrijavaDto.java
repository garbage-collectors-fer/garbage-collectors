package hr.fer.ecosentry.dto;

import hr.fer.ecosentry.model.Kategorija;
import hr.fer.ecosentry.model.NacinSanacije;
import hr.fer.ecosentry.model.Prijava;
import hr.fer.ecosentry.model.StatusPrijave;

import java.time.Instant;

public record PrijavaDto (
        Long id,
        Double lat,
        Double lng,
        String adresa,
        KategorijaDto kategorija,
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

    /** Kategorija iz tablice kategorija: id (za slanje) i naziv (za prikaz). */
    public record KategorijaDto(Long id, String naziv) {
        public static KategorijaDto iz(Kategorija k) {
            return k == null ? null : new KategorijaDto(k.getId(), k.getNaziv());
        }
    }

    public static PrijavaDto iz(Prijava p, boolean prikaziPrijavitelja) {    //iz entitya stvara record
        return new PrijavaDto(p.getId(),
                p.getLat(),
                p.getLng(),
                p.getAdresa(),
                KategorijaDto.iz(p.getKategorija()),
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
//glavna promjena je sto u JSON-u prijave kategorija vise nije tekst, vec objakt, to se mijenja za frontedn u biti
}