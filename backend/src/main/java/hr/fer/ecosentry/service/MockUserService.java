package hr.fer.ecosentry.service;

import java.util.Map;

import org.springframework.stereotype.Service;

@Service
public class MockUserService {

    private final Map<String, String> users = Map.of(
        "aki.pandzic64@gmail.com", "gradanin",
        "colin.creevy64@gmail.com", "gradanin",
        "nikola.mihanovic11@gmail.com", "gradanin",
        "tibi.hobit@gmail.com", "redar",
        "markovinovicivana57@gmail.com", "redar",
        "bruno.hrgovan@gmail.com", "gradanin",
        "leo.zigman@gmail.com", "udruga",
        "pavao.marsic@gmail.com", "gradanin"
    );

    public String getRole(String email) {
        return users.get(email);
    }
}