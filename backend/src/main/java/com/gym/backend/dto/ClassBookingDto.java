package com.gym.backend.dto;

import com.gym.backend.entity.enums.BookingStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * DTO for class bookings
 */
@Data
public class ClassBookingDto {

    private Long id;

    private String bookingReference;

    @NotNull(message = "Status is required")
    private BookingStatus status;

    @NotNull(message = "Booking date is required")
    private LocalDateTime bookingDate;

    private String cancellationReason;

    private LocalDateTime cancellationDate;

    private boolean attended;

    private LocalDateTime attendanceTime;

    private Double amountPaid;

    @NotNull(message = "Member ID is required")
    private Long memberId;

    @NotNull(message = "Class schedule ID is required")
    private Long classScheduleId;

    private MemberDto member;

    private ClassScheduleDto classSchedule;
}