package hr.fer.ecosentry.service;

import java.util.ArrayList;
import java.util.Collection;

import hr.fer.ecosentry.model.Korisnik;
import hr.fer.ecosentry.model.Uloga;
import hr.fer.ecosentry.repository.KorisnikRepository;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomOidcUserService extends OidcUserService {

    private final KorisnikRepository korisnikRepository;

    public CustomOidcUserService(KorisnikRepository korisnikRepository) {
        this.korisnikRepository = korisnikRepository;
    }

    @Override
    public OidcUser loadUser(OidcUserRequest request)
            throws OAuth2AuthenticationException {

        OidcUser user = super.loadUser(request);

        if (!user.getEmailVerified()) {
            throw new OAuth2AuthenticationException("Google email is not verified");
        }

        String email = user.getEmail();

        String ime = user.getFullName() != null ? user.getFullName() : email;

        Korisnik korisnik = korisnikRepository.findByEmail(email)       // standardno ponašanje, novom korisniku se dodjeljuje obična uloga građana
                .orElseGet(() -> new Korisnik(ime, email, Uloga.GRADANIN));

        korisnik.setIme(ime);
        korisnikRepository.save(korisnik);

        Collection<GrantedAuthority> authorities = new ArrayList<>(user.getAuthorities());

        authorities.add(new SimpleGrantedAuthority("ROLE_" + korisnik.getUloga().name()));


        return new org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser(
            authorities,
            user.getIdToken(),
            user.getUserInfo()
        );
    }
}