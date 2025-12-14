package com.gym.backend.service;

import com.gym.backend.dto.PaymentDto;
import com.gym.backend.entity.Payment;
import com.gym.backend.entity.enums.PaymentStatus;
import com.gym.backend.entity.enums.PaymentMethod;
import com.gym.backend.exception.ResourceNotFoundException;
import com.gym.backend.repository.PaymentRepository;
import com.gym.backend.repository.MemberProfileRepository;
import com.gym.backend.util.DtoMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for managing payments
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final MemberProfileRepository memberProfileRepository;
    private final DtoMapper dtoMapper;
    private final PaymentGatewayService paymentGatewayService;

    /**
     * Process a payment
     */
    @Transactional
    public PaymentDto processPayment(PaymentDto paymentDto) {
        log.info("Processing payment of {} for member {}", paymentDto.getAmount(), paymentDto.getMemberId());

        // Validate member
        var member = memberProfileRepository.findById(paymentDto.getMemberId())
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with ID: " + paymentDto.getMemberId()));

        // Map DTO to entity
        Payment payment = dtoMapper.mapToPayment(paymentDto);
        payment.setPaymentDate(LocalDateTime.now());
        payment.setMember(member);
        payment.setStatus(PaymentStatus.PROCESSING);

        // Process payment through gateway
        try {
            var gatewayResult = paymentGatewayService.processPayment(
                paymentDto.getAmount(),
                paymentDto.getCurrency(),
                paymentDto.getPaymentMethod(),
                paymentDto.getGatewayTransactionId()
            );

            payment.setGatewayTransactionId(gatewayResult.getTransactionId());
            payment.setGatewayResponse(gatewayResult.getResponse());

            if (gatewayResult.isSuccess()) {
                payment.setStatus(PaymentStatus.COMPLETED);
                payment.setReceiptNumber(generateReceiptNumber());
            } else {
                payment.setStatus(PaymentStatus.FAILED);
                payment.setFailureReason(gatewayResult.getErrorMessage());
            }
        } catch (Exception e) {
            log.error("Payment processing failed", e);
            payment.setStatus(PaymentStatus.FAILED);
            payment.setFailureReason("Payment processing error: " + e.getMessage());
        }

        Payment savedPayment = paymentRepository.save(payment);
        log.info("Processed payment with ID: {} and status: {}", savedPayment.getId(), savedPayment.getStatus());

        return dtoMapper.mapToPaymentDto(savedPayment);
    }

    /**
     * Refund a payment
     */
    @Transactional
    public PaymentDto refundPayment(Long paymentId, java.math.BigDecimal refundAmount, String reason) {
        log.info("Refunding {} from payment {}", refundAmount, paymentId);

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with ID: " + paymentId));

        if (payment.getStatus() != PaymentStatus.COMPLETED) {
            throw new IllegalStateException("Can only refund completed payments");
        }

        if (refundAmount.compareTo(payment.getAmount()) > 0) {
            throw new IllegalArgumentException("Refund amount cannot exceed original payment amount");
        }

        // Process refund through gateway
        try {
            var gatewayResult = paymentGatewayService.refundPayment(
                payment.getGatewayTransactionId(),
                refundAmount,
                reason
            );

            if (gatewayResult.isSuccess()) {
                payment.setStatus(refundAmount.compareTo(payment.getAmount()) == 0 ?
                    PaymentStatus.REFUNDED : PaymentStatus.PARTIALLY_REFUNDED);
                log.info("Successfully refunded {} from payment {}", refundAmount, paymentId);
            } else {
                log.error("Refund failed: {}", gatewayResult.getErrorMessage());
            }
        } catch (Exception e) {
            log.error("Refund processing failed", e);
        }

        Payment updatedPayment = paymentRepository.save(payment);
        return dtoMapper.mapToPaymentDto(updatedPayment);
    }

    /**
     * Get payments by member ID
     */
    @Transactional(readOnly = true)
    public List<PaymentDto> getPaymentsByMember(Long memberId) {
        log.debug("Fetching payments for member ID: {}", memberId);
        return paymentRepository.findByMemberIdOrderByPaymentDateDesc(memberId).stream()
                .map(dtoMapper::mapToPaymentDto)
                .collect(Collectors.toList());
    }

    /**
     * Get payments by subscription ID
     */
    @Transactional(readOnly = true)
    public List<PaymentDto> getPaymentsBySubscription(Long subscriptionId) {
        log.debug("Fetching payments for subscription ID: {}", subscriptionId);
        return paymentRepository.findBySubscriptionIdOrderByPaymentDateDesc(subscriptionId).stream()
                .map(dtoMapper::mapToPaymentDto)
                .collect(Collectors.toList());
    }

    /**
     * Get payment by ID
     */
    @Transactional(readOnly = true)
    public PaymentDto getPaymentById(Long id) {
        log.debug("Fetching payment with ID: {}", id);
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with ID: " + id));
        return dtoMapper.mapToPaymentDto(payment);
    }

    /**
     * Get payments by status
     */
    @Transactional(readOnly = true)
    public List<PaymentDto> getPaymentsByStatus(PaymentStatus status) {
        log.debug("Fetching payments with status: {}", status);
        return paymentRepository.findByStatus(status).stream()
                .map(dtoMapper::mapToPaymentDto)
                .collect(Collectors.toList());
    }

    /**
     * Get payments in date range
     */
    @Transactional(readOnly = true)
    public List<PaymentDto> getPaymentsInDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        log.debug("Fetching payments from {} to {}", startDate, endDate);
        return paymentRepository.findPaymentsInDateRange(startDate, endDate).stream()
                .map(dtoMapper::mapToPaymentDto)
                .collect(Collectors.toList());
    }

    /**
     * Generate unique receipt number
     */
    private String generateReceiptNumber() {
        return "RCP" + System.currentTimeMillis();
    }
}
