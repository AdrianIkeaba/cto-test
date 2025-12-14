package com.gym.backend.entity;

import com.gym.backend.entity.enums.NotificationType;
import com.gym.backend.entity.enums.NotificationPriority;
import com.gym.backend.entity.enums.NotificationStatus;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Notification entity representing system notifications
 */
@Entity
@Table(name = "notifications")
@Data
@EqualsAndHashCode(callSuper = true)
public class Notification extends BaseEntity {

    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Column(name = "message", nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(name = "notification_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private NotificationType notificationType;

    @Column(name = "priority", nullable = false)
    @Enumerated(EnumType.STRING)
    private NotificationPriority priority;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private NotificationStatus status;

    @Column(name = "send_date")
    private LocalDateTime sendDate;

    @Column(name = "read_date")
    private LocalDateTime readDate;

    @Column(name = "scheduled_date")
    private LocalDateTime scheduledDate;

    @Column(name = "attempt_count", nullable = false)
    private Integer attemptCount = 0;

    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;

    @Column(name = "template_data", columnDefinition = "TEXT")
    private String templateData; // JSON string for template variables

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "template_id")
    private NotificationTemplate template;

    @OneToMany(mappedBy = "notification", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<EmailNotification> emailNotifications = new HashSet<>();
}
