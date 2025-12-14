package com.gym.backend.entity;

import com.gym.backend.entity.enums.EmailStatus;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

/**
 * EmailNotification entity representing email delivery tracking
 */
@Entity
@Table(name = "email_notifications")
@Data
@EqualsAndHashCode(callSuper = true)
public class EmailNotification extends BaseEntity {

    @Column(name = "recipient_email", nullable = false, length = 255)
    private String recipientEmail;

    @Column(name = "subject", nullable = false, length = 500)
    private String subject;

    @Column(name = "body", nullable = false, columnDefinition = "TEXT")
    private String body;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private EmailStatus status;

    @Column(name = "sent_date")
    private LocalDateTime sentDate;

    @Column(name = "delivery_date")
    private LocalDateTime deliveryDate;

    @Column(name = "read_date")
    private LocalDateTime readDate;

    @Column(name = "bounce_date")
    private LocalDateTime bounceDate;

    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;

    @Column(name = "retry_count", nullable = false)
    private Integer retryCount = 0;

    @Column(name = "max_retries", nullable = false)
    private Integer maxRetries = 3;

    @Column(name = "gateway_message_id", length = 255)
    private String gatewayMessageId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "notification_id", nullable = false)
    private Notification notification;
}
