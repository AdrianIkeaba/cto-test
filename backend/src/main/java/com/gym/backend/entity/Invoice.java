package com.gym.backend.entity;

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
    private Double subtotal;

    @Column(name = "tax_amount", precision = 10, scale = 2)
    private Double taxAmount = 0.0;

    @Column(name = "discount_amount", precision = 10, scale = 2)
    private Double discountAmount = 0.0;

    @Column(name = "total_amount", precision = 10, scale = 2, nullable = false)
    private Double totalAmount;

    @Column(name = "paid_amount", precision = 10, scale = 2)
    private Double paidAmount = 0.0;

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