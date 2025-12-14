package com.gym.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

/**
 * DTO for user information
 */
@Data
public class UserDto {

    private Long id;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;

    @NotBlank(message = "First name is required")
    @Size(max = 100, message = "First name cannot exceed 100 characters")
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(max = 100, message = "Last name cannot exceed 100 characters")
    private String lastName;

    private String phoneNumber;

    private LocalDate dateOfBirth;

    private boolean isActive;

    private boolean emailVerified;

    private LocalDateTime lastLoginAt;

    private Set<RoleDto> roles;

    private MemberProfileDto memberProfile;

    private TrainerDto trainerProfile;

    private StaffProfileDto staffProfile;
}
