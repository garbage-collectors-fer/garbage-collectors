package hr.fer.ecosentry.controller;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.oidcLogin;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.redirectedUrlPattern;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest(properties = {
	"GOOGLE_CLIENT_ID=test-client-id",
	"GOOGLE_CLIENT_SECRET=test-client-secret"
})
@AutoConfigureMockMvc
class KorisnikControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@Test
	void healthJeJavnoDostupan() throws Exception {
		mockMvc.perform(get("/api/health"))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.status").value("ok"));
	}

	@Test
	void stranicaFrontendaNijeZasticena() throws Exception {
		// u testu nema izgradenog frontenda, pa je 404, ali ne 401
		mockMvc.perform(get("/"))
			.andExpect(status().isNotFound());
	}

	@Test
	void neprijavljeniKorisnikDobiva401() throws Exception {
		mockMvc.perform(get("/api/me"))
			.andExpect(status().isUnauthorized())
			.andExpect(jsonPath("$.poruka").value("Korisnik nije prijavljen"));
	}

	@Test
	void prijavaPocinjePreusmjeravanjemNaGoogle() throws Exception {
		mockMvc.perform(get("/api/auth/google"))
			.andExpect(status().is3xxRedirection())
			.andExpect(redirectedUrlPattern("https://accounts.google.com/**"))
			.andExpect(header().string("Location",
				containsString("redirect_uri=http://localhost/api/auth/google/callback")));
	}

	@Test
	void prijavljeniKorisnikDobivaSvojePodatke() throws Exception {
		mockMvc.perform(get("/api/me").with(oidcLogin().idToken(token -> token
				.claim("name", "Ana Anić")
				.claim("email", "ana@example.com"))))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.ime").value("Ana Anić"))
			.andExpect(jsonPath("$.email").value("ana@example.com"))
			.andExpect(jsonPath("$.uloga").value("GRADANIN"))
			.andExpect(jsonPath("$.blokiran").value(false));
	}

	@Test
	void odjavaVraca200() throws Exception {
		mockMvc.perform(post("/api/auth/logout").with(oidcLogin()).with(csrf()))
			.andExpect(status().isOk());
	}

	@Test
	void odjavaBezCsrfTokenaJeOdbijena() throws Exception {
		mockMvc.perform(post("/api/auth/logout").with(oidcLogin()))
			.andExpect(status().isForbidden());
	}
}
