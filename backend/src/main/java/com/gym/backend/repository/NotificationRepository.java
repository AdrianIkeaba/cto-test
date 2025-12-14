package com.gym.backend.repository;

import com.gym.backend.entity.Notification;
import com.gym.backend.entity.enums.NotificationStatus;
import com.gym.backend.entity.enums.NotificationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository for Notification entities
 */
@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    /**
     * Find notifications by user
     */
    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);

    /**
     * Find notifications by status
     */
    List<Notification> findByStatus(NotificationStatus status);

    /**
     * Find notifications by type
     */
    List<Notification> findByNotificationType(NotificationType notificationType);

    /**
     * Find unread notifications for user
     */
    @Query("SELECT n FROM Notification n WHERE n.user.id = :userId AND n.status != 'READ' ORDER BY n.createdAt DESC")
    List<Notification> findUnreadNotificationsByUser(@Param("userId") Long userId);

    /**
     * Find scheduled notifications
     */
    @Query("SELECT n FROM Notification n WHERE n.scheduledDate <= :currentTime AND n.status = 'SCHEDULED' ORDER BY n.scheduledDate")
    List<Notification> findScheduledNotificationsReadyToSend(@Param("currentTime") LocalDateTime currentTime);

    /**
     * Find notifications by date range
     */
    @Query("SELECT n FROM Notification n WHERE n.createdAt >= :startDate AND n.createdAt <= :endDate ORDER BY n.createdAt DESC")
    List<Notification> findNotificationsInDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}