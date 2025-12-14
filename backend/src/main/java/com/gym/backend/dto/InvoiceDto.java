package com.gym.backend.dto;

import com.gym.backend.entity.enums.InvoiceStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Set;

/**
 * DTO for invoices
 */
@Data
public class InvoiceDto {

    private Long id;

    @NotNull(message = "Issue date is required")
    private LocalDateTime issueDate;

    @NotNull(message = "Due date is required")
    private LocalDateTime dueDate;

    @NotNull(message = "Status is required")
    private InvoiceStatus status;

    @NotNull(message = "Subtotal is required")
    private Double subtotal;

    private Double taxAmount;

    private Double discountAmount;

    @NotNull(message = "Total amount is required")
    private Double totalAmount;

    private Double paidAmount;

    private String notes;

    private String billingAddress;

    private Long subscriptionId;

    @NotNull(message = "Member ID is required")
    private Long memberId;

    private SubscriptionDto subscription;

    private MemberDto member;

    private Set<PaymentDto> payments;
}