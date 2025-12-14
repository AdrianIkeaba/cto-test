package com.gym.backend.dto.auth;

import com.gym.backend.entity.enums.RoleType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Set;

/**
 * DTO for authentication response containing JWT tokens and user information
 */
@Data
@Builder
public class AuthResponse {

    private String accessToken;
    private String refreshToken;
    private String tokenType = "Bearer";
    private long expiresIn;
    private UserInfo user;

    @Data
    @Builder
    public static class UserInfo {
        private Long id;
        private String email;
        private String firstName;
        private String lastName;
        private boolean isActive;
        private boolean isEmailVerified;
        private Set<RoleType> roles;
        private LocalDateTime lastLoginAt;
        private LocalDateTime createdAt;
    }
}