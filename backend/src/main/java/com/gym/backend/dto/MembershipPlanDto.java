package com.gym.backend.dto;

import com.gym.backend.entity.enums.BillingCycle;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

/**
 * DTO for membership plans
 */
@Data
public class MembershipPlanDto {

    private Long id;

    @NotNull(message = "Name is required")
    private String name;

    private String description;

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private java.math.BigDecimal price;

    @NotNull(message = "Billing cycle is required")
    private BillingCycle billingCycle;

    private Integer durationDays;

    private boolean includesPersonalTraining;

    private Integer maxPtSessionsPerMonth;

    private boolean includesGroupClasses;

    private boolean unlimitedGroupClasses;

    private Integer maxGroupClassesPerMonth;

    private String accessHours;

    private boolean priorityBooking;

    private boolean freezeAllowed;

    private Integer maxFreezeDays;

    private boolean isActive;
}
