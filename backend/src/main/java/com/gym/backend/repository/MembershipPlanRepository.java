package com.gym.backend.repository;

import com.gym.backend.entity.MembershipPlan;
import com.gym.backend.entity.enums.BillingCycle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for MembershipPlan entities
 */
@Repository
public interface MembershipPlanRepository extends JpaRepository<MembershipPlan, Long> {

    /**
     * Find active membership plans
     */
    List<MembershipPlan> findByIsActiveTrue();

    /**
     * Find membership plans by billing cycle
     */
    List<MembershipPlan> findByBillingCycleAndIsActiveTrue(BillingCycle billingCycle);

    /**
     * Find membership plans by price range
     */
    @Query("SELECT mp FROM MembershipPlan mp WHERE mp.price BETWEEN :minPrice AND :maxPrice AND mp.isActive = true")
    List<MembershipPlan> findByPriceRange(@Param("minPrice") Double minPrice, @Param("maxPrice") Double maxPrice);

    /**
     * Find membership plans that include personal training
     */
    @Query("SELECT mp FROM MembershipPlan mp WHERE mp.includesPersonalTraining = true AND mp.isActive = true")
    List<MembershipPlan> findPlansWithPersonalTraining();

    /**
     * Find membership plans that include group classes
     */
    @Query("SELECT mp FROM MembershipPlan mp WHERE mp.includesGroupClasses = true AND mp.isActive = true")
    List<MembershipPlan> findPlansWithGroupClasses();
}