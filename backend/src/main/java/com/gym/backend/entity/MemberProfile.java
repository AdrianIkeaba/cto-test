package com.gym.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;
import java.math.BigDecimal;

/**
 * Member profile entity representing gym member information
 */
@Entity
@Table(name = "member_profiles")
@Data
@EqualsAndHashCode(callSuper = true)
public class MemberProfile extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    private User user;

    @Column(name = "emergency_contact_name", length = 255)
    private String emergencyContactName;

    @Column(name = "emergency_contact_phone", length = 20)
    private String emergencyContactPhone;

    @Column(name = "medical_conditions", columnDefinition = "TEXT")
    private String medicalConditions;

    @Column(name = "fitness_goals", columnDefinition = "TEXT")
    private String fitnessGoals;

    @Column(name = "preferred_training_time", length = 50)
    private String preferredTrainingTime;

    @Column(name = "membership_type", length = 50)
    private String membershipType;

    @Column(name = "membership_start_date")
    private LocalDate membershipStartDate;

    @Column(name = "membership_end_date")
    private LocalDate membershipEndDate;

    @Column(name = "height_cm")
    private Integer heightCm;

    @Column(name = "weight_kg", precision = 5, scale = 2)
    private java.math.BigDecimal weightKg;

    @Column(name = "is_active")
    private boolean active = true;
}
