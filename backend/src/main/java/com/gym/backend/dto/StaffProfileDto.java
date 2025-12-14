package com.gym.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * DTO for staff profiles
 */
@Data
public class StaffProfileDto {

    private Long id;

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotBlank(message = "Employee ID is required")
    private String employeeId;

    private String department;

    private String position;

    private String accessLevel;

    private UserDto user;
}