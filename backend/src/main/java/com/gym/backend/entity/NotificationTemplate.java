package com.gym.backend.entity;

import com.gym.backend.entity.enums.NotificationType;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * NotificationTemplate entity representing reusable notification templates
 */
@Entity
@Table(name = "notification_templates")
@Data
@EqualsAndHashCode(callSuper = true)
public class NotificationTemplate extends BaseEntity {

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Column(name = "template_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private NotificationType templateType;

    @Column(name = "subject_template", nullable = false, length = 500)
    private String subjectTemplate;

    @Column(name = "message_template", nullable = false, columnDefinition = "TEXT")
    private String messageTemplate;

    @Column(name = "is_active")
    private boolean isActive = true;

    @Column(name = "variables", columnDefinition = "TEXT")
    private String variables; // JSON string listing template variables
}
