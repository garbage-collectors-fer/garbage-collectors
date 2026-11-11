package hr.fer.ecosentry.config;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

import jakarta.servlet.http.HttpServletResponse;

import hr.fer.ecosentry.service.CustomOidcUserService;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

	@Value("${app.frontend-url}")
	private String frontendUrl;

	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http
			.authorizeHttpRequests(auth -> auth
				.requestMatchers("/api/health").permitAll()
				.requestMatchers("/api/auth/**").permitAll()
				.requestMatchers("/api/**").authenticated()
				// stranice frontenda
				.anyRequest().permitAll())
			.oauth2Login(login -> login
				.authorizationEndpoint(endpoint -> endpoint.baseUri("/api/auth"))
				.redirectionEndpoint(endpoint -> endpoint.baseUri("/api/auth/*/callback"))
				.userInfoEndpoint(userInfo ->
					userInfo.oidcUserService(customOidcUserService)
				)
				.defaultSuccessUrl(frontendUrl, true))
			.logout(logout -> logout
				.logoutUrl("/api/auth/logout")
				.logoutSuccessHandler((request, response, authentication) ->
					response.setStatus(HttpServletResponse.SC_OK)))
			.exceptionHandling(exceptions -> exceptions
				.authenticationEntryPoint((request, response, e) ->
					greska(response, HttpServletResponse.SC_UNAUTHORIZED, "Korisnik nije prijavljen"))
				.accessDeniedHandler((request, response, e) ->
					greska(response, HttpServletResponse.SC_FORBIDDEN, "Nemate pravo na tu radnju")))
			.csrf(csrf -> csrf.spa());
		return http.build();
	}

	private static void greska(HttpServletResponse response, int status, String poruka) throws IOException {
		response.setStatus(status);
		response.setContentType("application/json;charset=UTF-8");
		response.getWriter().write("{\"poruka\":\"" + poruka + "\"}");
	}

	private final CustomOidcUserService customOidcUserService;

	public SecurityConfig(CustomOidcUserService customOidcUserService) {
    	this.customOidcUserService = customOidcUserService;
	}
}


