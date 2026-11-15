package hr.fer.ecosentry.controller;

import hr.fer.ecosentry.dto.PrijavaDto;
import hr.fer.ecosentry.dto.PrijavaIzmjenaDto;
import hr.fer.ecosentry.model.StatusPrijave;
import hr.fer.ecosentry.service.PrijavaService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class PrijavaControllerTest {
    private PrijavaService service;
    private PrijavaController controller;
    private OidcUser user;

    @BeforeEach
    void setUp() {
        service = mock(PrijavaService.class);
        controller = new PrijavaController(service);
        user = mock(OidcUser.class);
        when(user.getEmail()).thenReturn("gradanin@example.com");
    }

    @Test
    void dohvatiSveProsljedujeFiltereIEmail() {
        when(service.dohvatiVidljive("gradanin@example.com", StatusPrijave.PRIJAVLJENO, false)).thenReturn(List.of());
        assertTrue(controller.dohvatiSve(StatusPrijave.PRIJAVLJENO, false, user).isEmpty());
        verify(service).dohvatiVidljive("gradanin@example.com", StatusPrijave.PRIJAVLJENO, false);
    }

    @Test
    void stvoriProsljedujeSlikuLokacijuKategorijuIEmai() {
        var slika = new MockMultipartFile("slika", "otpad.jpg", "image/jpeg", new byte[]{1, 2, 3});
        when(service.stvori("gradanin@example.com", slika, 45.8, 15.9, 3L)).thenReturn(null);
        assertNull(controller.stvori(slika, 45.8, 15.9, 3L, user));
        verify(service).stvori("gradanin@example.com", slika, 45.8, 15.9, 3L);
    }

    @Test
    void dohvatiJednuProsljedujeIdIEmail() {
        when(service.dohvati(7L, "gradanin@example.com")).thenReturn(null);
        assertNull(controller.dohvatiJednu(7L, user));
        verify(service).dohvati(7L, "gradanin@example.com");
    }

    @Test
    void dohvatiMojeProsljedujeEmail() {
        when(service.dohvatiMoje("gradanin@example.com")).thenReturn(List.of());
        assertTrue(controller.dohvatiMoje(user).isEmpty());
        verify(service).dohvatiMoje("gradanin@example.com");
    }

    @Test
    void izmijeniProsljedujeIdIPodatke() {
        var izmjena = new PrijavaIzmjenaDto(true, null, null, null);
        when(service.izmijeni(9L, izmjena)).thenReturn(null);
        assertNull(controller.izmijeni(9L, izmjena));
        verify(service).izmijeni(9L, izmjena);
    }
}
