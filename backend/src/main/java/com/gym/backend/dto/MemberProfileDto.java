package com.gym.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * DTO for member profiles
 */
@Data
public class MemberProfileDto {

    private Long id;

    @NotNull(message = "User ID is required")
    private Long userId;

    private String emergencyContactName;

    private String emergencyContactPhone;

    private String medicalConditions;

    private String fitnessGoals;

    private String preferredTrainingTime;

    private String membershipType;

    private LocalDate membershipStartDate;

    private LocalDate membershipEndDate;

    private Integer heightCm;

    private BigDecimal weightKg;

    private UserDto user;
}