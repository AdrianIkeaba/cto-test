package com.gym.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.Duration;
import java.util.HashSet;
import java.util.Set;

/**
 * GymClass entity representing group fitness classes
 */
@Entity
@Table(name = "gym_classes")
@Data
@EqualsAndHashCode(callSuper = true)
public class GymClass extends BaseEntity {

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "duration_minutes", nullable = false)
    private Integer durationMinutes;

    @Column(name = "max_capacity", nullable = false)
    private Integer maxCapacity;

    @Column(name = "difficulty_level", length = 50)
    @Enumerated(EnumType.STRING)
    private ClassDifficulty difficultyLevel;

    @Column(name = "category", length = 100)
    @Enumerated(EnumType.STRING)
    private ClassCategory category;

    @Column(name = "is_active")
    private boolean isActive = true;

    @Column(name = "price", precision = 10, scale = 2)
    private Double price;

    @OneToMany(mappedBy = "gymClass", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<ClassSchedule> schedules = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trainer_id")
    private TrainerProfile trainer;
}