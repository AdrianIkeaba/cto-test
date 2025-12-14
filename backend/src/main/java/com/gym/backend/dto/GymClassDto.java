package com.gym.backend.dto;

import com.gym.backend.entity.enums.ClassCategory;
import com.gym.backend.entity.enums.ClassDifficulty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.Set;

/**
 * DTO for creating/updating gym classes
 */
@Data
public class GymClassDto {

    private Long id;

    @NotBlank(message = "Name is required")
    @Size(max = 255, message = "Name cannot exceed 255 characters")
    private String name;

    private String description;

    @NotNull(message = "Duration is required")
    @Positive(message = "Duration must be positive")
    private Integer durationMinutes;

    @NotNull(message = "Max capacity is required")
    @Positive(message = "Max capacity must be positive")
    private Integer maxCapacity;

    private ClassDifficulty difficultyLevel;

    private ClassCategory category;

    private boolean isActive;

    private java.math.BigDecimal price;

    private Long trainerId;

    private TrainerDto trainer;

    private Set<ClassScheduleDto> schedules;
}
