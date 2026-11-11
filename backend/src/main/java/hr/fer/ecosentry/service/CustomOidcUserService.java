package hr.fer.ecosentry.service;

import java.util.ArrayList;
import java.util.Collection;

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

    private final MockUserService mockUserService;

    public CustomOidcUserService(MockUserService mockUserService) {
        this.mockUserService = mockUserService;
    }

    @Override
    public OidcUser loadUser(OidcUserRequest request)
            throws OAuth2AuthenticationException {

        OidcUser user = super.loadUser(request);

        if (!user.getEmailVerified()) {
            throw new OAuth2AuthenticationException("Google email is not verified");
        }

        String email = user.getEmail();

        String role = mockUserService.getRole(email);

        if (role == null) {
            throw new OAuth2AuthenticationException(
                "User is not registered in EcoSentry"
            );
        }

        Collection<GrantedAuthority> authorities =
            new ArrayList<>(user.getAuthorities());

        authorities.add(new SimpleGrantedAuthority("ROLE_" + role));

        return new org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser(
            authorities,
            user.getIdToken(),
            user.getUserInfo()
        );
    }
}