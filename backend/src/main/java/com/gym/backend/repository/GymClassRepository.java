package com.gym.backend.repository;

import com.gym.backend.entity.GymClass;
import com.gym.backend.entity.enums.ClassCategory;
import com.gym.backend.entity.enums.ClassDifficulty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for GymClass entities
 */
@Repository
public interface GymClassRepository extends JpaRepository<GymClass, Long> {

    /**
     * Find active gym classes
     */
    List<GymClass> findByIsActiveTrue();

    /**
     * Find gym classes by category
     */
    List<GymClass> findByCategoryAndIsActiveTrue(ClassCategory category);

    /**
     * Find gym classes by difficulty level
     */
    List<GymClass> findByDifficultyLevelAndIsActiveTrue(ClassDifficulty difficultyLevel);

    /**
     * Find gym classes by trainer
     */
    @Query("SELECT gc FROM GymClass gc WHERE gc.trainer.id = :trainerId AND gc.isActive = true")
    List<GymClass> findByTrainerIdAndIsActive(@Param("trainerId") Long trainerId);

    /**
     * Find gym classes by name containing (case insensitive)
     */
    @Query("SELECT gc FROM GymClass gc WHERE LOWER(gc.name) LIKE LOWER(CONCAT('%', :name, '%')) AND gc.isActive = true")
    List<GymClass> findByNameContainingIgnoreCaseAndIsActiveTrue(@Param("name") String name);
}