package com.gym.backend.repository;

import com.gym.backend.entity.Invoice;
import com.gym.backend.entity.enums.InvoiceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository for Invoice entities
 */
@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {

    /**
     * Find invoices by member
     */
    List<Invoice> findByMemberIdOrderByIssueDateDesc(Long memberId);

    /**
     * Find invoices by status
     */
    List<Invoice> findByStatus(InvoiceStatus status);

    /**
     * Find invoices by subscription
     */
    List<Invoice> findBySubscriptionIdOrderByIssueDateDesc(Long subscriptionId);

    /**
     * Find overdue invoices
     */
    @Query("SELECT i FROM Invoice i WHERE i.dueDate < :currentDate AND i.status IN ('SENT', 'OVERDUE')")
    List<Invoice> findOverdueInvoices(@Param("currentDate") LocalDateTime currentDate);

    /**
     * Find invoices by invoice number
     */
    Invoice findByInvoiceNumber(String invoiceNumber);

    /**
     * Find invoices by date range
     */
    @Query("SELECT i FROM Invoice i WHERE i.issueDate >= :startDate AND i.issueDate <= :endDate ORDER BY i.issueDate DESC")
    List<Invoice> findInvoicesInDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    /**
     * Calculate total invoiced amount in date range
     */
    @Query("SELECT SUM(i.totalAmount) FROM Invoice i WHERE i.issueDate >= :startDate AND i.issueDate <= :endDate")
    Double calculateTotalInvoicedAmountInDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}