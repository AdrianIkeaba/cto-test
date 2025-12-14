package com.gym.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

/**
 * DTO for trainer profiles
 */
@Data
public class TrainerDto {

    private Long id;

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotBlank(message = "Employee ID is required")
    private String employeeId;

    private String specialization;

    private Integer yearsOfExperience;

    private String certifications;

    private BigDecimal hourlyRate;

    private String bio;

    private UserDto user;
}