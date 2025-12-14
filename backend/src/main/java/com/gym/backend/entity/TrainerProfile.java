package com.gym.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

/**
 * Trainer profile entity representing gym trainer information
 */
@Entity
@Table(name = "trainer_profiles")
@Data
@EqualsAndHashCode(callSuper = true)
public class TrainerProfile extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    private User user;

    @Column(name = "employee_id", unique = true, nullable = false, length = 50)
    private String employeeId;

    @Column(name = "specialization", length = 255)
    private String specialization;

    @Column(name = "years_of_experience")
    private Integer yearsOfExperience;

    @Column(name = "certifications", columnDefinition = "TEXT")
    private String certifications;

    @Column(name = "hourly_rate", precision = 10, scale = 2)
    private BigDecimal hourlyRate;

    @Column(name = "bio", columnDefinition = "TEXT")
    private String bio;
}