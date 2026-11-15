package hr.fer.ecosentry.config;

import hr.fer.ecosentry.controller.PrijavaController;
import org.junit.jupiter.api.Test;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PatchMapping;

import static org.junit.jupiter.api.Assertions.*;

class AutorizacijaTest {
    @Test
    void stvaranjePrijaveZahtijevaUloguGradjanina() throws Exception {
        var method = PrijavaController.class.getMethod("stvori",
                org.springframework.web.multipart.MultipartFile.class, double.class, double.class,
                Long.class, org.springframework.security.oauth2.core.oidc.user.OidcUser.class);
        assertEquals("hasRole('GRADANIN')", method.getAnnotation(PreAuthorize.class).value());
        assertNotNull(method.getAnnotation(PostMapping.class));
    }

    @Test
    void dohvacanjeMojihPrijavaZahtijevaUloguGradjanina() throws Exception {
        var method = PrijavaController.class.getMethod("dohvatiMoje",
                org.springframework.security.oauth2.core.oidc.user.OidcUser.class);
        assertEquals("hasRole('GRADANIN')", method.getAnnotation(PreAuthorize.class).value());
        assertNotNull(method.getAnnotation(GetMapping.class));
    }

    @Test
    void izmjenaPrijaveZahtijevaUloguRedara() throws Exception {
        var method = PrijavaController.class.getMethod("izmijeni", Long.class,
                hr.fer.ecosentry.dto.PrijavaIzmjenaDto.class);
        assertEquals("hasRole('REDAR')", method.getAnnotation(PreAuthorize.class).value());
        assertNotNull(method.getAnnotation(PatchMapping.class));
    }

    @Test
    void citanjePojedinacnePrijaveNemaDodatniRoleUvjet() throws Exception {
        var method = PrijavaController.class.getMethod("dohvatiJednu", Long.class,
                org.springframework.security.oauth2.core.oidc.user.OidcUser.class);
        assertNull(method.getAnnotation(PreAuthorize.class));
    }
}
