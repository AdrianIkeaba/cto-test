package com.gym.backend.repository;

import com.gym.backend.entity.ClassBooking;
import com.gym.backend.entity.ClassSchedule;
import com.gym.backend.entity.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository for ClassBooking entities
 */
@Repository
public interface ClassBookingRepository extends JpaRepository<ClassBooking, Long> {

    /**
     * Find bookings by member
     */
    List<ClassBooking> findByMemberIdOrderByBookingDateDesc(Long memberId);

    /**
     * Find bookings by class schedule
     */
    List<ClassBooking> findByClassScheduleIdAndStatus(ClassSchedule classSchedule, BookingStatus status);

    /**
     * Find bookings by status
     */
    List<ClassBooking> findByStatus(BookingStatus status);

    /**
     * Find upcoming bookings for a member
     */
    @Query("SELECT cb FROM ClassBooking cb WHERE cb.member.id = :memberId AND cb.classSchedule.startTime > :currentTime AND cb.status = 'CONFIRMED' ORDER BY cb.classSchedule.startTime")
    List<ClassBooking> findUpcomingBookingsForMember(@Param("memberId") Long memberId, @Param("currentTime") LocalDateTime currentTime);

    /**
     * Find bookings by date range
     */
    @Query("SELECT cb FROM ClassBooking cb WHERE cb.classSchedule.startTime >= :startDate AND cb.classSchedule.startTime <= :endDate ORDER BY cb.classSchedule.startTime")
    List<ClassBooking> findBookingsInDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    /**
     * Find bookings by booking reference
     */
    ClassBooking findByBookingReference(String bookingReference);

    /**
     * Count bookings for a schedule
     */
    @Query("SELECT COUNT(cb) FROM ClassBooking cb WHERE cb.classSchedule.id = :scheduleId AND cb.status = 'CONFIRMED'")
    Long countConfirmedBookingsForSchedule(@Param("scheduleId") Long scheduleId);

    /**
     * Find member bookings for specific schedule and date
     */
    @Query("SELECT cb FROM ClassBooking cb WHERE cb.member.id = :memberId AND cb.classSchedule.id = :scheduleId AND cb.classSchedule.startTime = :startTime AND cb.status IN ('CONFIRMED', 'PENDING')")
    List<ClassBooking> findMemberBookingsForScheduleAndTime(@Param("memberId") Long memberId, @Param("scheduleId") Long scheduleId, @Param("startTime") LocalDateTime startTime);
}
