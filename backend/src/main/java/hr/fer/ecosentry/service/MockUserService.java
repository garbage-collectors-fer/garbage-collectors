package hr.fer.ecosentry.service;

import java.util.Map;

import org.springframework.stereotype.Service;

@Service
public class MockUserService {

    private final Map<String, String> users = Map.of(
        "aki.pandzic64@gmail.com", "gradanin",
        "colin.creevy64@gmail.com", "redar"
    );

    public String getRole(String email) {
        return users.get(email);
    }
}