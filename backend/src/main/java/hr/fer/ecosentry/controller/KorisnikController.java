package hr.fer.ecosentry.controller;

import java.util.Map;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class KorisnikController {

	public record Korisnik(Long id, String ime, String email, String uloga, boolean blokiran, String razlogBlokade) {
	}

	@GetMapping("/health")
	public Map<String, String> health() {
		return Map.of("status", "ok");
	}

	@GetMapping("/me")
	public Korisnik me(@AuthenticationPrincipal OidcUser user) {
		// id, uloga i blokada citat ce se iz baze kad bude tablica korisnika;
		// dotad je svaki korisnik prijavljen Googleom GRADANIN.
		return new Korisnik(null, user.getFullName(), user.getEmail(), "GRADANIN", false, null);
	}
}
