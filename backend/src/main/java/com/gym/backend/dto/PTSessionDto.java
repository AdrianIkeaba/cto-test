package com.gym.backend.dto;

import com.gym.backend.entity.enums.SessionStatus;
import com.gym.backend.entity.enums.SessionType;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * DTO for personal training sessions
 */
@Data
public class PTSessionDto {

    private Long id;

    @NotNull(message = "Session date is required")
    @Future(message = "Session date must be in the future")
    private LocalDateTime sessionDate;

    @NotNull(message = "Duration is required")
    @Positive(message = "Duration must be positive")
    private Integer durationMinutes;

    @NotNull(message = "Status is required")
    private SessionStatus status;

    private SessionType sessionType;

    private String goals;

    private String workoutNotes;

    private String clientFeedback;

    private Double rating;

    private Double price;

    private String cancellationReason;

    private LocalDateTime cancellationTime;

    private boolean isMakeupSession;

    private String roomLocation;

    @NotNull(message = "Member ID is required")
    private Long memberId;

    @NotNull(message = "Trainer ID is required")
    private Long trainerId;

    private MemberDto member;

    private TrainerDto trainer;
}