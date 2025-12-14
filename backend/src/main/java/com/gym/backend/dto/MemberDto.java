package com.gym.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

/**
 * DTO for member information
 */
@Data
public class MemberDto {

    private Long id;

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotBlank(message = "Emergency contact name is required")
    private String emergencyContactName;

    @NotBlank(message = "Emergency contact phone is required")
    private String emergencyContactPhone;

    private String medicalConditions;

    private String fitnessGoals;

    private String preferredWorkoutTimes;

    private LocalDate membershipStartDate;

    private LocalDate membershipEndDate;

    private boolean isActive;

    private UserDto user;
}