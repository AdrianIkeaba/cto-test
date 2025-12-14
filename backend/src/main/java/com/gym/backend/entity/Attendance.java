package com.gym.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Attendance entity representing gym visit tracking
 */
@Entity
@Table(name = "attendance")
@Data
@EqualsAndHashCode(callSuper = true)
public class Attendance extends BaseEntity {

    @Column(name = "check_in_time", nullable = false)
    private java.time.LocalDateTime checkInTime;

    @Column(name = "check_out_time")
    private java.time.LocalDateTime checkOutTime;

    @Column(name = "visit_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private VisitType visitType;

    @Column(name = "purpose", length = 255)
    private String purpose;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private MemberProfile member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_booking_id")
    private ClassBooking classBooking;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pt_session_id")
    private PTSession ptSession;
}