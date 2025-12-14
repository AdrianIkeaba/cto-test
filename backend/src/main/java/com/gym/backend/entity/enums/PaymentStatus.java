package com.gym.backend.entity.enums;

/**
 * Enumeration representing payment statuses
 */
public enum PaymentStatus {
    PENDING,
    COMPLETED,
    FAILED,
    REFUNDED,
    PARTIALLY_REFUNDED,
    CANCELLED,
    PROCESSING
}