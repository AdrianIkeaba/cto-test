package com.gym.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Subscription entity representing member subscriptions to membership plans
 */
@Entity
@Table(name = "subscriptions")
@Data
@EqualsAndHashCode(callSuper = true)
public class Subscription extends BaseEntity {

    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private SubscriptionStatus status;

    @Column(name = "auto_renewal")
    private boolean autoRenewal = true;

    @Column(name = "billing_day")
    private Integer billingDay; // Day of month for billing

    @Column(name = "last_billing_date")
    private LocalDateTime lastBillingDate;

    @Column(name = "next_billing_date")
    private LocalDateTime nextBillingDate;

    @Column(name = "freeze_start_date")
    private LocalDateTime freezeStartDate;

    @Column(name = "freeze_end_date")
    private LocalDateTime freezeEndDate;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "total_paid", precision = 10, scale = 2)
    private Double totalPaid = 0.0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private MemberProfile member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "membership_plan_id", nullable = false)
    private MembershipPlan membershipPlan;

    @OneToMany(mappedBy = "subscription", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Payment> payments = new HashSet<>();

    @OneToMany(mappedBy = "subscription", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Invoice> invoices = new HashSet<>();
}