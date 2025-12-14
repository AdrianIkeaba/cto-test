package com.gym.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * ClassBooking entity representing member bookings for gym classes
 */
@Entity
@Table(name = "class_bookings")
@Data
@EqualsAndHashCode(callSuper = true)
public class ClassBooking extends BaseEntity {

    @Column(name = "booking_reference", unique = true, nullable = false, length = 50)
    private String bookingReference;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private BookingStatus status;

    @Column(name = "booking_date", nullable = false)
    private java.time.LocalDateTime bookingDate;

    @Column(name = "cancellation_reason", columnDefinition = "TEXT")
    private String cancellationReason;

    @Column(name = "cancellation_date")
    private java.time.LocalDateTime cancellationDate;

    @Column(name = "attended")
    private boolean attended = false;

    @Column(name = "attendance_time")
    private java.time.LocalDateTime attendanceTime;

    @Column(name = "amount_paid", precision = 10, scale = 2)
    private Double amountPaid;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private MemberProfile member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_schedule_id", nullable = false)
    private ClassSchedule classSchedule;
}