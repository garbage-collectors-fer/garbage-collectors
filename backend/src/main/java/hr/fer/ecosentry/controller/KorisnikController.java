package hr.fer.ecosentry.controller;

import java.util.Map;


import hr.fer.ecosentry.dto.KorisnikDto;
import hr.fer.ecosentry.repository.KorisnikRepository;
import org.springframework.http.HttpStatus;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api")
public class KorisnikController {


	private final KorisnikRepository korisnikRepository;

	public KorisnikController(KorisnikRepository korisnikRepository) {
		this.korisnikRepository = korisnikRepository;
	}

	@GetMapping("/health")
	public Map<String, String> health() {
		return Map.of("status", "ok");
	}

	@GetMapping("/me")
	public KorisnikDto me(@AuthenticationPrincipal OidcUser user) {
		return korisnikRepository.findByEmail(user.getEmail())
				.map(KorisnikDto::iz)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
	}

}
