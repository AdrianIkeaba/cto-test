package com.gym.backend.dto;

import com.gym.backend.entity.enums.PaymentMethod;
import com.gym.backend.entity.enums.PaymentStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * DTO for payments
 */
@Data
public class PaymentDto {

    private Long id;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private Double amount;

    @NotNull(message = "Currency is required")
    private String currency;

    @NotNull(message = "Payment method is required")
    private PaymentMethod paymentMethod;

    @NotNull(message = "Status is required")
    private PaymentStatus status;

    @NotNull(message = "Payment date is required")
    private LocalDateTime paymentDate;

    private LocalDateTime dueDate;

    private String gatewayTransactionId;

    private String gatewayResponse;

    private String failureReason;

    private String receiptNumber;

    private String notes;

    private Long subscriptionId;

    private Long invoiceId;

    @NotNull(message = "Member ID is required")
    private Long memberId;

    private SubscriptionDto subscription;

    private InvoiceDto invoice;

    private MemberDto member;
}