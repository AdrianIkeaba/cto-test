package com.gym.backend.entity.enums;

/**
 * Enumeration representing invoice statuses
 */
public enum InvoiceStatus {
    DRAFT,
    SENT,
    PAID,
    OVERDUE,
    CANCELLED,
    PARTIALLY_PAID,
    REFUNDED
}