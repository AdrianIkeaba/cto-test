package com.gym.backend.service;

import com.gym.backend.dto.MembershipPlanDto;
import com.gym.backend.entity.MembershipPlan;
import com.gym.backend.entity.enums.BillingCycle;
import com.gym.backend.exception.ResourceNotFoundException;
import com.gym.backend.repository.MembershipPlanRepository;
import com.gym.backend.util.DtoMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for managing membership plans
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class MembershipPlanService {

    private final MembershipPlanRepository membershipPlanRepository;
    private final DtoMapper dtoMapper;

    /**
     * Create a new membership plan
     */
    @Transactional
    public MembershipPlanDto createMembershipPlan(MembershipPlanDto planDto) {
        log.info("Creating new membership plan: {}", planDto.getName());

        MembershipPlan plan = dtoMapper.mapToMembershipPlan(planDto);
        plan.setIsActive(true);

        MembershipPlan savedPlan = membershipPlanRepository.save(plan);
        log.info("Created membership plan with ID: {}", savedPlan.getId());

        return dtoMapper.mapToMembershipPlanDto(savedPlan);
    }

    /**
     * Update membership plan
     */
    @Transactional
    public MembershipPlanDto updateMembershipPlan(Long id, MembershipPlanDto planDto) {
        log.info("Updating membership plan with ID: {}", id);

        MembershipPlan existingPlan = membershipPlanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Membership plan not found with ID: " + id));

        existingPlan.setName(planDto.getName());
        existingPlan.setDescription(planDto.getDescription());
        existingPlan.setPrice(planDto.getPrice());
        existingPlan.setBillingCycle(planDto.getBillingCycle());
        existingPlan.setDurationDays(planDto.getDurationDays());
        existingPlan.setIncludesPersonalTraining(planDto.isIncludesPersonalTraining());
        existingPlan.setMaxPtSessionsPerMonth(planDto.getMaxPtSessionsPerMonth());
        existingPlan.setIncludesGroupClasses(planDto.isIncludesGroupClasses());
        existingPlan.setUnlimitedGroupClasses(planDto.isUnlimitedGroupClasses());
        existingPlan.setMaxGroupClassesPerMonth(planDto.getMaxGroupClassesPerMonth());
        existingPlan.setAccessHours(planDto.getAccessHours());
        existingPlan.setPriorityBooking(planDto.isPriorityBooking());
        existingPlan.setFreezeAllowed(planDto.isFreezeAllowed());
        existingPlan.setMaxFreezeDays(planDto.getMaxFreezeDays());

        MembershipPlan updatedPlan = membershipPlanRepository.save(existingPlan);
        log.info("Updated membership plan with ID: {}", updatedPlan.getId());

        return dtoMapper.mapToMembershipPlanDto(updatedPlan);
    }

    /**
     * Delete membership plan (soft delete)
     */
    @Transactional
    public void deleteMembershipPlan(Long id) {
        log.info("Deleting membership plan with ID: {}", id);

        MembershipPlan plan = membershipPlanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Membership plan not found with ID: " + id));

        plan.setIsActive(false);
        membershipPlanRepository.save(plan);

        log.info("Soft deleted membership plan with ID: {}", id);
    }

    /**
     * Get all membership plans
     */
    @Transactional(readOnly = true)
    public List<MembershipPlanDto> getAllMembershipPlans() {
        log.debug("Fetching all membership plans");
        return membershipPlanRepository.findAll().stream()
                .map(dtoMapper::mapToMembershipPlanDto)
                .collect(Collectors.toList());
    }

    /**
     * Get active membership plans
     */
    @Transactional(readOnly = true)
    public List<MembershipPlanDto> getActiveMembershipPlans() {
        log.debug("Fetching active membership plans");
        return membershipPlanRepository.findByIsActiveTrue().stream()
                .map(dtoMapper::mapToMembershipPlanDto)
                .collect(Collectors.toList());
    }

    /**
     * Get membership plan by ID
     */
    @Transactional(readOnly = true)
    public MembershipPlanDto getMembershipPlanById(Long id) {
        log.debug("Fetching membership plan with ID: {}", id);
        MembershipPlan plan = membershipPlanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Membership plan not found with ID: " + id));
        return dtoMapper.mapToMembershipPlanDto(plan);
    }

    /**
     * Get membership plans by billing cycle
     */
    @Transactional(readOnly = true)
    public List<MembershipPlanDto> getMembershipPlansByBillingCycle(BillingCycle billingCycle) {
        log.debug("Fetching membership plans by billing cycle: {}", billingCycle);
        return membershipPlanRepository.findByBillingCycleAndIsActiveTrue(billingCycle).stream()
                .map(dtoMapper::mapToMembershipPlanDto)
                .collect(Collectors.toList());
    }

    /**
     * Get membership plans by price range
     */
    @Transactional(readOnly = true)
    public List<MembershipPlanDto> getMembershipPlansByPriceRange(Double minPrice, Double maxPrice) {
        log.debug("Fetching membership plans by price range: {} - {}", minPrice, maxPrice);
        return membershipPlanRepository.findByPriceRange(minPrice, maxPrice).stream()
                .map(dtoMapper::mapToMembershipPlanDto)
                .collect(Collectors.toList());
    }

    /**
     * Get membership plans with personal training
     */
    @Transactional(readOnly = true)
    public List<MembershipPlanDto> getMembershipPlansWithPersonalTraining() {
        log.debug("Fetching membership plans with personal training");
        return membershipPlanRepository.findPlansWithPersonalTraining().stream()
                .map(dtoMapper::mapToMembershipPlanDto)
                .collect(Collectors.toList());
    }

    /**
     * Get membership plans with group classes
     */
    @Transactional(readOnly = true)
    public List<MembershipPlanDto> getMembershipPlansWithGroupClasses() {
        log.debug("Fetching membership plans with group classes");
        return membershipPlanRepository.findPlansWithGroupClasses().stream()
                .map(dtoMapper::mapToMembershipPlanDto)
                .collect(Collectors.toList());
    }
}