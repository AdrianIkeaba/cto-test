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
    List<MembershipPlan> findByActiveTrue();

    /**
     * Find membership plans by billing cycle
     */
    List<MembershipPlan> findByBillingCycleAndActiveTrue(BillingCycle billingCycle);

    /**
     * Find membership plans by price range
     */
    @Query("SELECT mp FROM MembershipPlan mp WHERE mp.price BETWEEN :minPrice AND :maxPrice AND mp.active = true")
    List<MembershipPlan> findByPriceRange(@Param("minPrice") java.math.BigDecimal minPrice, @Param("maxPrice") java.math.BigDecimal maxPrice);

    /**
     * Find membership plans that include personal training
     */
    @Query("SELECT mp FROM MembershipPlan mp WHERE mp.includesPersonalTraining = true AND mp.active = true")
    List<MembershipPlan> findPlansWithPersonalTraining();

    /**
     * Find membership plans that include group classes
     */
    @Query("SELECT mp FROM MembershipPlan mp WHERE mp.includesGroupClasses = true AND mp.active = true")
    List<MembershipPlan> findPlansWithGroupClasses();
}
