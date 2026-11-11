package hr.fer.ecosentry.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping("/gradanin")
    @PreAuthorize("hasRole('gradanin')")
    public String user() {
        return "You have Gradanin role";
    }

    @GetMapping("/redar")
    @PreAuthorize("hasRole('redar')")
    public String admin() {
        return "You have Redar role";
    }
}