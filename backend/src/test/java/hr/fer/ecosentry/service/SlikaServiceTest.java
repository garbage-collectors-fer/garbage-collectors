package hr.fer.ecosentry.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyMap;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.util.Map;

import com.cloudinary.Cloudinary;
import com.cloudinary.Uploader;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.http.HttpStatus;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.server.ResponseStatusException;

/**
 * Jedinicni testovi spremanja slika prijava (SlikaService). Cloudinary je zamijenjen
 * lazom (Mockito), pa testovi ne zovu stvarnu uslugu i ne trebaju kljuceve.
 *
 * Oznake CT-xx odgovaraju ispitnim slucajevima u docs/5-Ispitivanje.md.
 */
class SlikaServiceTest {

    private static final String URL_SLIKE = "https://res.cloudinary.com/demo/image/upload/ecosentry/prijave/otpad.png";

    private Uploader uploader;
    private SlikaService service;

    @BeforeEach
    void priprema() {
        Cloudinary cloudinary = mock(Cloudinary.class);
        uploader = mock(Uploader.class);
        when(cloudinary.uploader()).thenReturn(uploader);
        service = new SlikaService(cloudinary);
    }

    // CT-22
    @Test
    @SuppressWarnings("unchecked")
    void spremi_valjanaSlika_saljeNaCloudinaryIVracaUrl() throws IOException {
        byte[] sadrzaj = {10, 20, 30, 40};
        MockMultipartFile slika = new MockMultipartFile("slika", "otpad.png", "image/png", sadrzaj);
        doReturn(Map.of("secure_url", URL_SLIKE)).when(uploader).upload(any(), anyMap());

        String url = service.spremi(slika);

        assertEquals(URL_SLIKE, url);
        ArgumentCaptor<Object> datoteka = ArgumentCaptor.forClass(Object.class);
        ArgumentCaptor<Map> opcije = ArgumentCaptor.forClass(Map.class);
        verify(uploader).upload(datoteka.capture(), opcije.capture());
        assertEquals(sadrzaj.length, ((byte[]) datoteka.getValue()).length);
        assertEquals("ecosentry/prijave", opcije.getValue().get("folder"));
    }

    // CT-23
    @Test
    void spremi_nedostajucaIliPrazna_vracaBadRequest() throws IOException {
        MockMultipartFile prazna = new MockMultipartFile("slika", "otpad.jpg", "image/jpeg", new byte[0]);

        ResponseStatusException bezSlike = assertThrows(ResponseStatusException.class, () -> service.spremi(null));
        ResponseStatusException praznaSlika = assertThrows(ResponseStatusException.class, () -> service.spremi(prazna));

        assertEquals(HttpStatus.BAD_REQUEST.value(), bezSlike.getStatusCode().value());
        assertEquals(HttpStatus.BAD_REQUEST.value(), praznaSlika.getStatusCode().value());
        verify(uploader, never()).upload(any(), anyMap());
    }

    // CT-24
    @Test
    void spremi_datotekaKojaNijeSlika_vracaBadRequestINistaSeNeSalje() throws IOException {
        MockMultipartFile pdf = new MockMultipartFile("slika", "dokument.pdf", "application/pdf", new byte[] {1, 2, 3});

        ResponseStatusException e = assertThrows(ResponseStatusException.class, () -> service.spremi(pdf));

        assertEquals(HttpStatus.BAD_REQUEST.value(), e.getStatusCode().value());
        verify(uploader, never()).upload(any(), anyMap());
    }

    // dodatni slucaj (nije u dokumentu 5): WEBP vise nije dopusten
    @Test
    void spremi_webp_vracaBadRequest() throws IOException {
        MockMultipartFile webp = new MockMultipartFile("slika", "otpad.webp", "image/webp", new byte[] {1, 2, 3});

        ResponseStatusException e = assertThrows(ResponseStatusException.class, () -> service.spremi(webp));

        assertEquals(HttpStatus.BAD_REQUEST.value(), e.getStatusCode().value());
        verify(uploader, never()).upload(any(), anyMap());
    }

    // dodatni slucaj (nije u dokumentu 5): Cloudinary ne radi, korisnik dobiva 500 s porukom
    @Test
    void spremi_cloudinaryNeuspjeh_vracaInternalServerError() throws IOException {
        MockMultipartFile slika = new MockMultipartFile("slika", "otpad.jpg", "image/jpeg", new byte[] {1, 2, 3});
        doThrow(new IOException("mreza ne radi")).when(uploader).upload(any(), anyMap());

        ResponseStatusException e = assertThrows(ResponseStatusException.class, () -> service.spremi(slika));

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getStatusCode().value());
        assertEquals("Spremanje slike nije uspjelo", e.getReason());
    }
}
