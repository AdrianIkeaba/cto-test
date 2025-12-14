package com.gym.backend.service;

import com.gym.backend.dto.SubscriptionDto;
import com.gym.backend.entity.MembershipPlan;
import com.gym.backend.entity.MemberProfile;
import com.gym.backend.entity.Subscription;
import com.gym.backend.entity.enums.SubscriptionStatus;
import com.gym.backend.exception.ResourceNotFoundException;
import com.gym.backend.exception.BusinessRuleException;
import com.gym.backend.repository.SubscriptionRepository;
import com.gym.backend.repository.MembershipPlanRepository;
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
 * Service for managing membership subscriptions
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final MembershipPlanRepository membershipPlanRepository;
    private final MemberProfileRepository memberProfileRepository;
    private final DtoMapper dtoMapper;

    /**
     * Create a new subscription
     */
    @Transactional
    public SubscriptionDto createSubscription(SubscriptionDto subscriptionDto) {
        log.info("Creating subscription for member ID: {}", subscriptionDto.getMemberId());

        // Validate member
        MemberProfile member = memberProfileRepository.findById(subscriptionDto.getMemberId())
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with ID: " + subscriptionDto.getMemberId()));

        // Validate membership plan
        MembershipPlan plan = membershipPlanRepository.findById(subscriptionDto.getMembershipPlanId())
                .orElseThrow(() -> new ResourceNotFoundException("Membership plan not found with ID: " + subscriptionDto.getMembershipPlanId()));

        // Check for active subscriptions
        List<Subscription> activeSubscriptions = subscriptionRepository.findActiveSubscriptions().stream()
                .filter(s -> s.getMember().getId().equals(subscriptionDto.getMemberId()))
                .collect(Collectors.toList());

        if (!activeSubscriptions.isEmpty()) {
            throw new BusinessRuleException("Member already has an active subscription");
        }

        Subscription subscription = new Subscription();
        subscription.setStartDate(subscriptionDto.getStartDate());
        subscription.setStatus(SubscriptionStatus.ACTIVE);
        subscription.setAutoRenewal(subscriptionDto.isAutoRenewal());
        subscription.setBillingDay(subscriptionDto.getBillingDay());
        subscription.setMember(member);
        subscription.setMembershipPlan(plan);

        // Calculate end date if plan has duration
        if (plan.getDurationDays() != null) {
            subscription.setEndDate(subscriptionDto.getStartDate().plusDays(plan.getDurationDays()));
        }

        // Calculate next billing date
        if (subscriptionDto.getBillingDay() != null) {
            subscription.setNextBillingDate(calculateNextBillingDate(subscriptionDto));
        }

        Subscription savedSubscription = subscriptionRepository.save(subscription);
        log.info("Created subscription with ID: {}", savedSubscription.getId());

        return dtoMapper.mapToSubscriptionDto(savedSubscription);
    }

    /**
     * Update subscription status
     */
    @Transactional
    public SubscriptionDto updateSubscriptionStatus(Long subscriptionId, SubscriptionStatus status, String notes) {
        log.info("Updating subscription status to {} for subscription ID: {}", status, subscriptionId);

        Subscription subscription = subscriptionRepository.findById(subscriptionId)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found with ID: " + subscriptionId));

        subscription.setStatus(status);
        subscription.setNotes(notes);

        // Handle specific status transitions
        switch (status) {
            case SUSPENDED:
                // Suspend subscription
                break;
            case CANCELLED:
                // Cancel subscription
                subscription.setEndDate(LocalDateTime.now());
                break;
            case FROZEN:
                subscription.setFreezeStartDate(LocalDateTime.now());
                break;
            case ACTIVE:
                // Reactivate from frozen state
                if (subscription.getStatus() == SubscriptionStatus.FROZEN) {
                    subscription.setFreezeEndDate(LocalDateTime.now());
                }
                break;
        }

        Subscription updatedSubscription = subscriptionRepository.save(subscription);
        log.info("Updated subscription status to {}", status);

        return dtoMapper.mapToSubscriptionDto(updatedSubscription);
    }

    /**
     * Freeze subscription
     */
    @Transactional
    public SubscriptionDto freezeSubscription(Long subscriptionId, int days) {
        log.info("Freezing subscription ID: {} for {} days", subscriptionId, days);

        Subscription subscription = subscriptionRepository.findById(subscriptionId)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found with ID: " + subscriptionId));

        if (subscription.getStatus() != SubscriptionStatus.ACTIVE) {
            throw new BusinessRuleException("Can only freeze active subscriptions");
        }

        if (!subscription.getMembershipPlan().isFreezeAllowed()) {
            throw new BusinessRuleException("Freezing is not allowed for this membership plan");
        }

        if (days > subscription.getMembershipPlan().getMaxFreezeDays()) {
            throw new BusinessRuleException("Freeze duration exceeds maximum allowed days for this plan");
        }

        subscription.setStatus(SubscriptionStatus.FROZEN);
        subscription.setFreezeStartDate(LocalDateTime.now());
        subscription.setFreezeEndDate(LocalDateTime.now().plusDays(days));

        Subscription updatedSubscription = subscriptionRepository.save(subscription);
        log.info("Frozen subscription for {} days", days);

        return dtoMapper.mapToSubscriptionDto(updatedSubscription);
    }

    /**
     * Process subscription renewal
     */
    @Transactional
    public SubscriptionDto processRenewal(Long subscriptionId) {
        log.info("Processing renewal for subscription ID: {}", subscriptionId);

        Subscription subscription = subscriptionRepository.findById(subscriptionId)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found with ID: " + subscriptionId));

        if (!subscription.isAutoRenewal()) {
            throw new BusinessRuleException("Auto-renewal is not enabled for this subscription");
        }

        if (subscription.getStatus() != SubscriptionStatus.ACTIVE) {
            throw new BusinessRuleException("Can only renew active subscriptions");
        }

        MembershipPlan plan = subscription.getMembershipPlan();
        
        // Extend subscription based on billing cycle
        LocalDateTime newEndDate;
        if (plan.getDurationDays() != null) {
            newEndDate = subscription.getEndDate() != null ? 
                subscription.getEndDate().plusDays(plan.getDurationDays()) :
                LocalDateTime.now().plusDays(plan.getDurationDays());
        } else {
            // Open-ended subscription
            newEndDate = subscription.getEndDate();
        }

        subscription.setEndDate(newEndDate);
        subscription.setLastBillingDate(LocalDateTime.now());
        subscription.setNextBillingDate(calculateNextBillingDate(subscription.getMembershipPlan().getBillingCycle(), subscription.getNextBillingDate()));

        Subscription updatedSubscription = subscriptionRepository.save(subscription);
        log.info("Processed renewal for subscription ID: {}", subscriptionId);

        return dtoMapper.mapToSubscriptionDto(updatedSubscription);
    }

    /**
     * Get subscription by ID
     */
    @Transactional(readOnly = true)
    public SubscriptionDto getSubscriptionById(Long id) {
        log.debug("Fetching subscription with ID: {}", id);
        Subscription subscription = subscriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found with ID: " + id));
        return dtoMapper.mapToSubscriptionDto(subscription);
    }

    /**
     * Get subscriptions by member ID
     */
    @Transactional(readOnly = true)
    public List<SubscriptionDto> getSubscriptionsByMember(Long memberId) {
        log.debug("Fetching subscriptions for member ID: {}", memberId);
        return subscriptionRepository.findByMemberIdOrderByStartDateDesc(memberId).stream()
                .map(dtoMapper::mapToSubscriptionDto)
                .collect(Collectors.toList());
    }

    /**
     * Get active subscriptions
     */
    @Transactional(readOnly = true)
    public List<SubscriptionDto> getActiveSubscriptions() {
        log.debug("Fetching active subscriptions");
        return subscriptionRepository.findActiveSubscriptions().stream()
                .map(dtoMapper::mapToSubscriptionDto)
                .collect(Collectors.toList());
    }

    /**
     * Get expiring subscriptions
     */
    @Transactional(readOnly = true)
    public List<SubscriptionDto> getExpiringSubscriptions(int daysAhead) {
        log.debug("Fetching subscriptions expiring in {} days", daysAhead);
        LocalDateTime currentDate = LocalDateTime.now();
        LocalDateTime expiryDate = currentDate.plusDays(daysAhead);
        
        return subscriptionRepository.findExpiringSubscriptions(currentDate, expiryDate).stream()
                .map(dtoMapper::mapToSubscriptionDto)
                .collect(Collectors.toList());
    }

    /**
     * Get overdue subscriptions
     */
    @Transactional(readOnly = true)
    public List<SubscriptionDto> getOverdueSubscriptions() {
        log.debug("Fetching overdue subscriptions");
        return subscriptionRepository.findOverdueSubscriptions(LocalDateTime.now()).stream()
                .map(dtoMapper::mapToSubscriptionDto)
                .collect(Collectors.toList());
    }

    /**
     * Calculate next billing date
     */
    private LocalDateTime calculateNextBillingDate(SubscriptionDto subscriptionDto) {
        LocalDateTime nextBilling = subscriptionDto.getStartDate();
        MembershipPlan plan = membershipPlanRepository.findById(subscriptionDto.getMembershipPlanId())
                .orElseThrow(() -> new ResourceNotFoundException("Membership plan not found"));
        
        return calculateNextBillingDate(plan.getBillingCycle(), nextBilling);
    }

    /**
     * Calculate next billing date based on billing cycle
     */
    private LocalDateTime calculateNextBillingDate(com.gym.backend.entity.enums.BillingCycle billingCycle, LocalDateTime currentDate) {
        return switch (billingCycle) {
            case MONTHLY -> currentDate.plusMonths(1);
            case QUARTERLY -> currentDate.plusMonths(3);
            case BIANNUAL -> currentDate.plusMonths(6);
            case ANNUAL -> currentDate.plusYears(1);
            case WEEKLY -> currentDate.plusWeeks(1);
            case DAILY -> currentDate.plusDays(1);
        };
    }
}