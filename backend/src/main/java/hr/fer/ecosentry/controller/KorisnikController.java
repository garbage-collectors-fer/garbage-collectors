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
		String uloga = user.getAuthorities().stream()
			.map(authority -> authority.getAuthority())
			.filter(authority -> authority.startsWith("ROLE_"))
			.map(authority -> authority.substring(5))
			.findFirst()
			.orElse("nepoznato");

		return new Korisnik(
			null,
			user.getFullName(),
			user.getEmail(),
			uloga,
			false,
			null
		);
	}
}
