package com.gym.backend.dto;

import com.gym.backend.entity.enums.NotificationType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * DTO for notification templates
 */
@Data
public class NotificationTemplateDto {

    private Long id;

    @NotNull(message = "Name is required")
    private String name;

    @NotNull(message = "Template type is required")
    private NotificationType templateType;

    @NotBlank(message = "Subject template is required")
    private String subjectTemplate;

    @NotBlank(message = "Message template is required")
    private String messageTemplate;

    private boolean isActive;

    private String variables;
}