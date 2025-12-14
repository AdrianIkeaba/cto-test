package com.gym.backend.dto;

import com.gym.backend.entity.enums.RecurrencePattern;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Set;

/**
 * DTO for class schedules
 */
@Data
public class ClassScheduleDto {

    private Long id;

    @NotNull(message = "Start time is required")
    @Future(message = "Start time must be in the future")
    private LocalDateTime startTime;

    @NotNull(message = "End time is required")
    private LocalDateTime endTime;

    private Integer currentBookings;

    private String roomName;

    private boolean isRecurring;

    private RecurrencePattern recurrencePattern;

    private Integer recurrenceDayOfWeek;

    private LocalDateTime recurrenceEndDate;

    private boolean isActive;

    private Long gymClassId;

    private GymClassDto gymClass;

    private Set<ClassBookingDto> bookings;
}