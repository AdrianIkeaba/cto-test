package com.gym.backend.controller;

import com.gym.backend.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * Health check controller for monitoring application status
 */
@Slf4j
@RestController
@RequestMapping
@Tag(name = "Health", description = "Health check API")
public class HealthController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/")
    @Operation(summary = "Root endpoint", description = "Returns basic application information")
    public ResponseEntity<Map<String, String>> root() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Gym Management System Backend API");
        response.put("version", "1.0.0");
        response.put("status", "running");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/health")
    @Operation(summary = "Detailed health check", description = "Returns detailed application and database status")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> response = new HashMap<>();
        
        // Application status
        response.put("status", "UP");
        response.put("application", "Gym Management System Backend");
        response.put("version", "1.0.0");
        
        // Database status
        Map<String, String> dbStatus = new HashMap<>();
        try {
            long userCount = userRepository.count();
            dbStatus.put("status", "UP");
            dbStatus.put("message", "Database connection successful");
            dbStatus.put("userCount", String.valueOf(userCount));
        } catch (Exception e) {
            log.error("Database health check failed", e);
            dbStatus.put("status", "DOWN");
            dbStatus.put("message", "Database connection failed: " + e.getMessage());
        }
        response.put("database", dbStatus);
        
        return ResponseEntity.ok(response);
    }
}