package com.gym.backend.repository;

import com.gym.backend.entity.Payment;
import com.gym.backend.entity.enums.PaymentMethod;
import com.gym.backend.entity.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository for Payment entities
 */
@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    /**
     * Find payments by member
     */
    List<Payment> findByMemberIdOrderByPaymentDateDesc(Long memberId);

    /**
     * Find payments by subscription
     */
    List<Payment> findBySubscriptionIdOrderByPaymentDateDesc(Long subscriptionId);

    /**
     * Find payments by status
     */
    List<Payment> findByStatus(PaymentStatus status);

    /**
     * Find payments by method
     */
    List<Payment> findByPaymentMethod(PaymentMethod paymentMethod);

    /**
     * Find payments by date range
     */
    @Query("SELECT p FROM Payment p WHERE p.paymentDate >= :startDate AND p.paymentDate <= :endDate ORDER BY p.paymentDate DESC")
    List<Payment> findPaymentsInDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    /**
     * Find payments by gateway transaction ID
     */
    Payment findByGatewayTransactionId(String gatewayTransactionId);

    /**
     * Calculate total revenue in date range
     */
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.paymentDate >= :startDate AND p.paymentDate <= :endDate AND p.status = 'COMPLETED'")
    Double calculateTotalRevenueInDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    /**
     * Count successful payments by member
     */
    @Query("SELECT COUNT(p) FROM Payment p WHERE p.member.id = :memberId AND p.status = 'COMPLETED'")
    Long countSuccessfulPaymentsByMember(@Param("memberId") Long memberId);
}