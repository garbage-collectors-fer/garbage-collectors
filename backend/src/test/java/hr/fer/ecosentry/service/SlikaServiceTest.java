package hr.fer.ecosentry.service;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.stream.Stream;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.http.HttpStatus;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.server.ResponseStatusException;

/**
 * Jedinicni testovi spremanja slika prijava (SlikaService). Slike se spremaju u
 * privremenu mapu koju JUnit sam brise, pa testovi ne diraju stvarnu mapu uploads/.
 *
 * Oznake CT-xx odgovaraju ispitnim slucajevima u docs/5-Ispitivanje.md.
 */
class SlikaServiceTest {

    @TempDir
    Path privremenaMapa;

    private SlikaService service;

    @BeforeEach
    void priprema() throws IOException {
        service = new SlikaService();
        ReflectionTestUtils.setField(service, "uploadDir", privremenaMapa.toString());
        service.pripremiMapu();

        // SlikaService gradi puni URL iz trenutnog HTTP zahtjeva, pa mu ga simuliramo
        MockHttpServletRequest zahtjev = new MockHttpServletRequest();
        zahtjev.setScheme("http");
        zahtjev.setServerName("localhost");
        zahtjev.setServerPort(8080);
        RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(zahtjev));
    }

    @AfterEach
    void ocisti() {
        RequestContextHolder.resetRequestAttributes();
    }

    // CT-22
    @Test
    void spremi_valjanaSlika_spremaDatotekuIVracaUrl() throws IOException {
        byte[] sadrzaj = {10, 20, 30, 40};
        MockMultipartFile slika = new MockMultipartFile("slika", "otpad.png", "image/png", sadrzaj);

        String url = service.spremi(slika);

        assertTrue(url.startsWith("http://localhost:8080/uploads/"));
        assertTrue(url.endsWith(".png"));
        String imeDatoteke = url.substring(url.lastIndexOf('/') + 1);
        Path spremljena = privremenaMapa.resolve(imeDatoteke);
        assertTrue(Files.exists(spremljena));
        assertArrayEquals(sadrzaj, Files.readAllBytes(spremljena));
    }

    // CT-23
    @Test
    void spremi_nedostajucaIliPrazna_vracaBadRequest() {
        MockMultipartFile prazna = new MockMultipartFile("slika", "otpad.jpg", "image/jpeg", new byte[0]);

        ResponseStatusException bezSlike = assertThrows(ResponseStatusException.class, () -> service.spremi(null));
        ResponseStatusException praznaSlika = assertThrows(ResponseStatusException.class, () -> service.spremi(prazna));

        assertEquals(HttpStatus.BAD_REQUEST.value(), bezSlike.getStatusCode().value());
        assertEquals(HttpStatus.BAD_REQUEST.value(), praznaSlika.getStatusCode().value());
    }

    // CT-24
    @Test
    void spremi_datotekaKojaNijeSlika_vracaBadRequestINistaSeNeSprema() throws IOException {
        MockMultipartFile pdf = new MockMultipartFile("slika", "dokument.pdf", "application/pdf", new byte[] {1, 2, 3});

        ResponseStatusException e = assertThrows(ResponseStatusException.class, () -> service.spremi(pdf));

        assertEquals(HttpStatus.BAD_REQUEST.value(), e.getStatusCode().value());
        try (Stream<Path> datoteke = Files.list(privremenaMapa)) {
            assertEquals(0, datoteke.count());
        }
    }
}
