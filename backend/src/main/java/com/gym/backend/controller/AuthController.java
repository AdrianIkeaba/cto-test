package com.gym.backend.controller;

import com.gym.backend.dto.auth.*;
import com.gym.backend.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for authentication endpoints
 */
@Slf4j
@RestController
@RequestMapping("/auth")
@Tag(name = "Authentication", description = "Authentication API endpoints")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Register new user", description = "Creates a new user account and returns JWT tokens")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        log.info("Registration request received for email: {}", request.getEmail());
        
        try {
            AuthResponse response = authService.register(request);
            log.info("User registered successfully: {}", request.getEmail());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Registration failed for email: {} - {}", request.getEmail(), e.getMessage());
            throw e;
        }
    }

    @PostMapping("/login")
    @Operation(summary = "User login", description = "Authenticates user credentials and returns JWT tokens")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        log.info("Login request received for email: {}", request.getEmail());
        
        try {
            AuthResponse response = authService.login(request);
            log.info("User logged in successfully: {}", request.getEmail());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Login failed for email: {} - {}", request.getEmail(), e.getMessage());
            throw e;
        }
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh access token", description = "Generates new access token using refresh token")
    public ResponseEntity<AuthResponse> refreshToken(@RequestHeader("Authorization") String refreshToken) {
        log.debug("Token refresh request received");
        
        try {
            // Extract token from Bearer format
            String token = refreshToken.replace("Bearer ", "");
            AuthResponse response = authService.refreshToken(token);
            log.debug("Token refreshed successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Token refresh failed - {}", e.getMessage());
            throw e;
        }
    }

    @PostMapping("/password-reset")
    @Operation(summary = "Request password reset", description = "Sends password reset email to user")
    public ResponseEntity<Void> requestPasswordReset(@Valid @RequestBody PasswordResetRequest request) {
        log.info("Password reset requested for email: {}", request.getEmail());
        
        try {
            authService.requestPasswordReset(request);
            log.info("Password reset email sent to: {}", request.getEmail());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Password reset request failed for email: {} - {}", request.getEmail(), e.getMessage());
            throw e;
        }
    }

    @PostMapping("/password-reset-confirm")
    @Operation(summary = "Confirm password reset", description = "Resets user password using reset token")
    public ResponseEntity<Void> confirmPasswordReset(@Valid @RequestBody PasswordResetConfirmRequest request) {
        log.debug("Password reset confirmation received");
        
        try {
            authService.confirmPasswordReset(request);
            log.info("Password reset completed successfully");
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Password reset confirmation failed - {}", e.getMessage());
            throw e;
        }
    }

    @GetMapping("/verify-email")
    @Operation(summary = "Verify email address", description = "Verifies user email using verification token")
    public ResponseEntity<Void> verifyEmail(@RequestParam String token) {
        log.debug("Email verification request received with token: {}", token);
        
        try {
            authService.verifyEmail(token);
            log.info("Email verified successfully");
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Email verification failed - {}", e.getMessage());
            throw e;
        }
    }

    @PostMapping("/logout")
    @Operation(summary = "User logout", description = "Invalidates user session (client should discard tokens)")
    public ResponseEntity<Void> logout() {
        log.info("Logout request received");
        
        // In a stateless JWT implementation, logout is handled on the client side
        // by simply discarding the tokens
        log.info("Logout processed successfully");
        return ResponseEntity.ok().build();
    }
}