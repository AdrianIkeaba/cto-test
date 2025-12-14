package com.gym.backend.dto;

import com.gym.backend.entity.enums.EquipmentCategory;
import com.gym.backend.entity.enums.EquipmentStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * DTO for equipment
 */
@Data
public class EquipmentDto {

    private Long id;

    @NotBlank(message = "Name is required")
    private String name;

    private String description;

    private String equipmentCode;

    private EquipmentCategory category;

    private String brand;

    private String model;

    private String serialNumber;

    private LocalDate purchaseDate;

    private BigDecimal purchasePrice;

    private LocalDate warrantyExpiryDate;

    private LocalDate maintenanceDate;

    private LocalDate nextMaintenanceDate;

    private EquipmentStatus status;

    private String location;

    private boolean isActive;
}