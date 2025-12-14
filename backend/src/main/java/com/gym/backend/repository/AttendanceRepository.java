package com.gym.backend.repository;

import com.gym.backend.entity.Attendance;
import com.gym.backend.entity.enums.VisitType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository for Attendance entities
 */
@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    /**
     * Find attendance records by member
     */
    List<Attendance> findByMemberIdOrderByCheckInTimeDesc(Long memberId);

    /**
     * Find attendance records by visit type
     */
    List<Attendance> findByVisitType(VisitType visitType);

    /**
     * Find attendance records by date range
     */
    @Query("SELECT a FROM Attendance a WHERE a.checkInTime >= :startDate AND a.checkInTime <= :endDate ORDER BY a.checkInTime DESC")
    List<Attendance> findAttendanceInDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    /**
     * Find active check-ins (no check-out time)
     */
    @Query("SELECT a FROM Attendance a WHERE a.checkOutTime IS NULL ORDER BY a.checkInTime DESC")
    List<Attendance> findActiveCheckIns();

    /**
     * Count attendance records for member in date range
     */
    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.member.id = :memberId AND a.checkInTime >= :startDate AND a.checkInTime <= :endDate")
    Long countAttendanceForMemberInDateRange(@Param("memberId") Long memberId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    /**
     * Find attendance for specific class booking
     */
    List<Attendance> findByClassBookingIdOrderByCheckInTimeDesc(Long classBookingId);

    /**
     * Find attendance for specific PT session
     */
    List<Attendance> findByPtSessionIdOrderByCheckInTimeDesc(Long ptSessionId);
}