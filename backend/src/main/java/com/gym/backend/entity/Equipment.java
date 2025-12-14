package com.gym.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Equipment entity representing gym equipment inventory
 */
@Entity
@Table(name = "equipment")
@Data
@EqualsAndHashCode(callSuper = true)
public class Equipment extends BaseEntity {

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "equipment_code", unique = true, length = 50)
    private String equipmentCode;

    @Column(name = "category", length = 100)
    @Enumerated(EnumType.STRING)
    private EquipmentCategory category;

    @Column(name = "brand", length = 100)
    private String brand;

    @Column(name = "model", length = 100)
    private String model;

    @Column(name = "serial_number", length = 100)
    private String serialNumber;

    @Column(name = "purchase_date")
    private java.time.LocalDate purchaseDate;

    @Column(name = "purchase_price", precision = 10, scale = 2)
    private Double purchasePrice;

    @Column(name = "warranty_expiry_date")
    private java.time.LocalDate warrantyExpiryDate;

    @Column(name = "maintenance_date")
    private java.time.LocalDate maintenanceDate;

    @Column(name = "next_maintenance_date")
    private java.time.LocalDate nextMaintenanceDate;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private EquipmentStatus status;

    @Column(name = "location", length = 100)
    private String location;

    @Column(name = "is_active")
    private boolean isActive = true;
}