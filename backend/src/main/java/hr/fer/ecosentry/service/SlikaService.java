package hr.fer.ecosentry.service;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;
import java.util.UUID;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@Service
public class SlikaService {
    private static final Map<String, String> DOPUSTENI_TIPOVI = Map.of(
            "image/jpeg", ".jpg",
            "image/png", ".png",
            "image/webp", ".webp"
    );

    @Value("${app.upload-dir}")
    private String uploadDir;

    private Path mapa;

    @PostConstruct
    void pripremiMapu() throws IOException {
        mapa = Path.of(uploadDir).toAbsolutePath().normalize();
        Files.createDirectories(mapa);      // stvara uploads/ ako ne postoji
        // kasnije će biti cloudinary.uploader().upload(
        // deleta se kasnije kada setupamo platformu za slike
    }

    // sprema sliku i vraća njezin puni URL
    public String spremi(MultipartFile slika) {
        if (slika == null || slika.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Slika je obavezna");
        }

        String ekstenzija = DOPUSTENI_TIPOVI.get(slika.getContentType());
        if (ekstenzija == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Slika mora biti JPG, PNG ili WEBP");
        }

        String ime = UUID.randomUUID() + ekstenzija;    // nasumično ime, originalno se ne koristi

        try (InputStream ulaz = slika.getInputStream()) {
            Files.copy(ulaz, mapa.resolve(ime));
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Spremanje slike nije uspjelo");
        }
        return ServletUriComponentsBuilder.fromCurrentContextPath()   // http://localhost:8080 ili Render adresa
                .path("/uploads/")
                .path(ime)
                .toUriString();
    }
}
