package com.gym.backend.repository;

import com.gym.backend.entity.NotificationTemplate;
import com.gym.backend.entity.enums.NotificationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for NotificationTemplate entities
 */
@Repository
public interface NotificationTemplateRepository extends JpaRepository<NotificationTemplate, Long> {

    /**
     * Find templates by type
     */
    List<NotificationTemplate> findByTemplateTypeAndIsActiveTrue(NotificationType templateType);

    /**
     * Find active templates
     */
    List<NotificationTemplate> findByIsActiveTrue();
}