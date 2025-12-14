package com.gym.backend.entity;

import com.gym.backend.entity.enums.InvoiceStatus;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Invoice entity representing billing invoices
 */
@Entity
@Table(name = "invoices")
@Data
@EqualsAndHashCode(callSuper = true)
public class Invoice extends BaseEntity {

    @Column(name = "invoice_number", unique = true, nullable = false, length = 50)
    private String invoiceNumber;

    @Column(name = "issue_date", nullable = false)
    private LocalDateTime issueDate;

    @Column(name = "due_date", nullable = false)
    private LocalDateTime dueDate;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private InvoiceStatus status;

    @Column(name = "subtotal", precision = 10, scale = 2, nullable = false)
    private java.math.BigDecimal subtotal;

    @Column(name = "tax_amount", precision = 10, scale = 2)
    private java.math.BigDecimal taxAmount = java.math.BigDecimal.ZERO;

    @Column(name = "discount_amount", precision = 10, scale = 2)
    private java.math.BigDecimal discountAmount = java.math.BigDecimal.ZERO;

    @Column(name = "total_amount", precision = 10, scale = 2, nullable = false)
    private java.math.BigDecimal totalAmount;

    @Column(name = "paid_amount", precision = 10, scale = 2)
    private java.math.BigDecimal paidAmount = java.math.BigDecimal.ZERO;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "billing_address", columnDefinition = "TEXT")
    private String billingAddress;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subscription_id")
    private Subscription subscription;

    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Payment> payments = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private MemberProfile member;
}
