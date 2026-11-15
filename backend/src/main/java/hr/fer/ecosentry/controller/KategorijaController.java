package hr.fer.ecosentry.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import hr.fer.ecosentry.dto.PrijavaDto.KategorijaDto;
import hr.fer.ecosentry.repository.KategorijaRepository;

@RestController
@RequestMapping("/api/kategorije")
public class KategorijaController {

    private final KategorijaRepository kategorijaRepository;

    public KategorijaController(KategorijaRepository kategorijaRepository) {
        this.kategorijaRepository = kategorijaRepository;
    }

    // popis kategorija za padajući izbornik; frontend treba id-eve za slanje
    @GetMapping
    public List<KategorijaDto> dohvatiSve() {
        return kategorijaRepository.findAllByOrderByNazivAsc().stream()
                .map(KategorijaDto::iz)
                .toList();
    }
}
