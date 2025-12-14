package com.gym.backend.dto;

import com.gym.backend.entity.enums.NotificationPriority;
import com.gym.backend.entity.enums.NotificationStatus;
import com.gym.backend.entity.enums.NotificationType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * DTO for notifications
 */
@Data
public class NotificationDto {

    private Long id;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Message is required")
    private String message;

    @NotNull(message = "Notification type is required")
    private NotificationType notificationType;

    @NotNull(message = "Priority is required")
    private NotificationPriority priority;

    @NotNull(message = "Status is required")
    private NotificationStatus status;

    private LocalDateTime sendDate;

    private LocalDateTime readDate;

    private LocalDateTime scheduledDate;

    private Integer attemptCount;

    private String errorMessage;

    private String templateData;

    @NotNull(message = "User ID is required")
    private Long userId;

    private Long templateId;

    private UserDto user;

    private NotificationTemplateDto template;
}