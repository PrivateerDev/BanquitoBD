package com.banquito.controller;

import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class TestController {
    
    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "ok", "service", "banquito-backend");
    }
    
    @GetMapping("/devtools")
    public Map<String, String> devtools() {
        return Map.of("devtools", "available", "version", "0.0.1-SNAPSHOT");
    }
    
    @GetMapping("/")
    public Map<String, String> root() {
        return Map.of("message", "Banquito API v0.0.1", "endpoints", "/api/health, /api/devtools");
    }
}
