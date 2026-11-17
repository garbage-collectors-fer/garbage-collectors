package hr.fer.ecosentry.service;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;
import java.util.UUID;

import com.cloudinary.Cloudinary;
import com.cloudinary.Transformation;
import com.cloudinary.utils.ObjectUtils;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@Service
public class SlikaService {
    private static final Logger log = LoggerFactory.getLogger(SlikaService.class);

    private static final Map<String, String> DOPUSTENI_TIPOVI = Map.of(
            "image/jpeg", ".jpg",
            "image/png", ".png"
    );

    private final Cloudinary cloudinary;

    public SlikaService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    // sprema sliku i vraća njezin puni URL
    public String spremi(MultipartFile slika) {
        if (slika == null || slika.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Slika je obavezna");
        }

        String ekstenzija = DOPUSTENI_TIPOVI.get(slika.getContentType());
        if (ekstenzija == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Slika mora biti JPG ili PNG");
        }

        try {
            Map<?, ?> rezultat = cloudinary.uploader().upload(slika.getBytes(), ObjectUtils.asMap(
                    "folder", "ecosentry/prijave",      // mapa u Cloudinary konzoli
                    "resource_type", "image",
                    "transformation", new Transformation<>()
                            .width(1400).crop("limit")  // smanji ako je šira od 1400px
                            .quality("auto")
            ));
            return (String) rezultat.get("secure_url");    // https adresa slike, ide u bazu
        } catch (IOException | RuntimeException e) {
            log.error("Upload slike na Cloudinary nije uspio", e);     // testiranje
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Spremanje slike nije uspjelo");
        }
    }
}
