package com.gym.backend.dto;

import com.gym.backend.entity.enums.RoleType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * DTO for user roles
 */
@Data
public class RoleDto {

    private Long id;

    @NotNull(message = "Role name is required")
    private RoleType name;

    private String description;
}