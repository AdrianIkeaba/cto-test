package com.gym.backend.dto.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * DTO for password reset request
 */
@Data
public class PasswordResetRequest {

    @NotBlank(message = "Email is required")
    private String email;
}