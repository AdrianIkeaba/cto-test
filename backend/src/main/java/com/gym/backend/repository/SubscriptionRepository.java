package com.gym.backend.repository;

import com.gym.backend.entity.Subscription;
import com.gym.backend.entity.enums.SubscriptionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository for Subscription entities
 */
@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {

    /**
     * Find subscriptions by member
     */
    List<Subscription> findByMemberIdOrderByStartDateDesc(Long memberId);

    /**
     * Find subscriptions by status
     */
    List<Subscription> findByStatus(SubscriptionStatus status);

    /**
     * Find active subscriptions
     */
    @Query("SELECT s FROM Subscription s WHERE s.status = 'ACTIVE'")
    List<Subscription> findActiveSubscriptions();

    /**
     * Find subscriptions expiring soon
     */
    @Query("SELECT s FROM Subscription s WHERE s.endDate BETWEEN :currentDate AND :expiryDate AND s.status = 'ACTIVE'")
    List<Subscription> findExpiringSubscriptions(@Param("currentDate") LocalDateTime currentDate, @Param("expiryDate") LocalDateTime expiryDate);

    /**
     * Find subscriptions with overdue billing
     */
    @Query("SELECT s FROM Subscription s WHERE s.nextBillingDate < :currentDate AND s.status = 'ACTIVE'")
    List<Subscription> findOverdueSubscriptions(@Param("currentDate") LocalDateTime currentDate);

    /**
     * Find subscriptions by membership plan
     */
    List<Subscription> findByMembershipPlanId(Long membershipPlanId);

    /**
     * Find subscriptions with auto-renewal enabled
     */
    @Query("SELECT s FROM Subscription s WHERE s.autoRenewal = true AND s.status = 'ACTIVE'")
    List<Subscription> findAutoRenewalSubscriptions();
}