package com.gym.backend.entity.enums;

/**
 * Enumeration representing email delivery statuses
 */
public enum EmailStatus {
    PENDING,
    SENT,
    DELIVERED,
    READ,
    BOUNCED,
    FAILED,
    CANCELLED
}