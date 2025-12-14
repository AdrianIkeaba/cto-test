package com.gym.backend.repository;

import com.gym.backend.entity.StaffProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository interface for StaffProfile entity
 */
@Repository
public interface StaffProfileRepository extends JpaRepository<StaffProfile, Long> {

    /**
     * Find staff profile by user ID
     */
    Optional<StaffProfile> findByUserId(Long userId);

    /**
     * Find staff profile by employee ID
     */
    Optional<StaffProfile> findByEmployeeId(String employeeId);

    /**
     * Check if user has a staff profile
     */
    boolean existsByUserId(Long userId);

    /**
     * Check if employee ID exists
     */
    boolean existsByEmployeeId(String employeeId);
}