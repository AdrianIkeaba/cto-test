package com.gym.backend.dto;

import com.gym.backend.entity.enums.VisitType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * DTO for attendance records
 */
@Data
public class AttendanceDto {

    private Long id;

    @NotNull(message = "Check-in time is required")
    private LocalDateTime checkInTime;

    private LocalDateTime checkOutTime;

    @NotNull(message = "Visit type is required")
    private VisitType visitType;

    private String purpose;

    private String notes;

    @NotNull(message = "Member ID is required")
    private Long memberId;

    private Long classBookingId;

    private Long ptSessionId;

    private MemberDto member;

    private ClassBookingDto classBooking;

    private PTSessionDto ptSession;
}