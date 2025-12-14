package com.gym.backend.dto;

import com.gym.backend.entity.enums.SubscriptionStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Set;

/**
 * DTO for subscriptions
 */
@Data
public class SubscriptionDto {

    private Long id;

    @NotNull(message = "Start date is required")
    private LocalDateTime startDate;

    private LocalDateTime endDate;

    @NotNull(message = "Status is required")
    private SubscriptionStatus status;

    private boolean autoRenewal;

    private Integer billingDay;

    private LocalDateTime lastBillingDate;

    private LocalDateTime nextBillingDate;

    private LocalDateTime freezeStartDate;

    private LocalDateTime freezeEndDate;

    private String notes;

    private Double totalPaid;

    @NotNull(message = "Member ID is required")
    private Long memberId;

    @NotNull(message = "Membership plan ID is required")
    private Long membershipPlanId;

    private MemberDto member;

    private MembershipPlanDto membershipPlan;

    private Set<PaymentDto> payments;

    private Set<InvoiceDto> invoices;
}