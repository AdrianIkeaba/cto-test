package com.gym.backend.repository;

import com.gym.backend.entity.TrainerProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for TrainerProfile entity
 */
@Repository
public interface TrainerProfileRepository extends JpaRepository<TrainerProfile, Long> {

    /**
     * Find trainer profile by user ID
     */
    Optional<TrainerProfile> findByUserId(Long userId);

    /**
     * Find trainer profile by employee ID
     */
    Optional<TrainerProfile> findByEmployeeId(String employeeId);

    /**
     * Find trainer profiles by specialization
     */
    List<TrainerProfile> findBySpecialization(String specialization);

    /**
     * Find trainer profiles with minimum years of experience
     */
    @Query("SELECT tp FROM TrainerProfile tp WHERE tp.yearsOfExperience >= :minYears")
    List<TrainerProfile> findByYearsOfExperienceGreaterThanEqual(@Param("minYears") Integer minYears);

    /**
     * Count trainer profiles by specialization
     */
    @Query("SELECT COUNT(tp) FROM TrainerProfile tp WHERE tp.specialization = :specialization")
    long countBySpecialization(@Param("specialization") String specialization);

    /**
     * Check if user has a trainer profile
     */
    boolean existsByUserId(Long userId);

    /**
     * Check if employee ID exists
     */
    boolean existsByEmployeeId(String employeeId);
}