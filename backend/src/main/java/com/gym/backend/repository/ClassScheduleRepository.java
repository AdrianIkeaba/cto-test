package com.gym.backend.repository;

import com.gym.backend.entity.ClassSchedule;
import com.gym.backend.entity.enums.RecurrencePattern;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository for ClassSchedule entities
 */
@Repository
public interface ClassScheduleRepository extends JpaRepository<ClassSchedule, Long> {

    /**
     * Find schedules by gym class
     */
    List<ClassSchedule> findByGymClassIdAndIsActiveTrue(Long gymClassId);

    /**
     * Find upcoming schedules
     */
    @Query("SELECT cs FROM ClassSchedule cs WHERE cs.startTime > :currentTime AND cs.isActive = true ORDER BY cs.startTime")
    List<ClassSchedule> findUpcomingSchedules(@Param("currentTime") LocalDateTime currentTime);

    /**
     * Find schedules by date range
     */
    @Query("SELECT cs FROM ClassSchedule cs WHERE cs.startTime >= :startDate AND cs.endTime <= :endDate AND cs.isActive = true ORDER BY cs.startTime")
    List<ClassSchedule> findSchedulesInDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    /**
     * Find recurring schedules
     */
    List<ClassSchedule> findByRecurrencePatternAndIsActiveTrue(RecurrencePattern pattern);

    /**
     * Find schedules by day of week
     */
    @Query("SELECT cs FROM ClassSchedule cs WHERE cs.recurrenceDayOfWeek = :dayOfWeek AND cs.isActive = true")
    List<ClassSchedule> findByRecurrenceDayOfWeekAndIsActiveTrue(@Param("dayOfWeek") Integer dayOfWeek);

    /**
     * Find schedules with available capacity
     */
    @Query("SELECT cs FROM ClassSchedule cs WHERE cs.gymClass.maxCapacity > cs.currentBookings AND cs.startTime > :currentTime AND cs.isActive = true")
    List<ClassSchedule> findSchedulesWithAvailableCapacity(@Param("currentTime") LocalDateTime currentTime);
}