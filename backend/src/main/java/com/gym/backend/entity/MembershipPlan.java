package com.gym.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.Duration;
import java.util.HashSet;
import java.util.Set;

/**
 * MembershipPlan entity representing available membership plans
 */
@Entity
@Table(name = "membership_plans")
@Data
@EqualsAndHashCode(callSuper = true)
public class MembershipPlan extends BaseEntity {

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "price", precision = 10, scale = 2, nullable = false)
    private Double price;

    @Column(name = "billing_cycle", nullable = false)
    @Enumerated(EnumType.STRING)
    private BillingCycle billingCycle;

    @Column(name = "duration_days")
    private Integer durationDays; // null for open-ended plans

    @Column(name = "includes_personal_training")
    private boolean includesPersonalTraining = false;

    @Column(name = "max_pt_sessions_per_month")
    private Integer maxPtSessionsPerMonth;

    @Column(name = "includes_group_classes")
    private boolean includesGroupClasses = true;

    @Column(name = "unlimited_group_classes")
    private boolean unlimitedGroupClasses = true;

    @Column(name = "max_group_classes_per_month")
    private Integer maxGroupClassesPerMonth;

    @Column(name = "access_hours", length = 100)
    private String accessHours; // e.g., "6AM-10PM", "24/7"

    @Column(name = "priority_booking")
    private boolean priorityBooking = false;

    @Column(name = "freeze_allowed")
    private boolean freezeAllowed = true;

    @Column(name = "max_freeze_days")
    private Integer maxFreezeDays;

    @Column(name = "is_active")
    private boolean isActive = true;

    @OneToMany(mappedBy = "membershipPlan", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Subscription> subscriptions = new HashSet<>();
}