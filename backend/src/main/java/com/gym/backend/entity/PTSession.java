package com.gym.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.Duration;
import java.time.LocalDateTime;

/**
 * PTSession entity representing personal training sessions
 */
@Entity
@Table(name = "pt_sessions")
@Data
@EqualsAndHashCode(callSuper = true)
public class PTSession extends BaseEntity {

    @Column(name = "session_date", nullable = false)
    private LocalDateTime sessionDate;

    @Column(name = "duration_minutes", nullable = false)
    private Integer durationMinutes;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private SessionStatus status;

    @Column(name = "session_type", length = 100)
    @Enumerated(EnumType.STRING)
    private SessionType sessionType;

    @Column(name = "goals", columnDefinition = "TEXT")
    private String goals;

    @Column(name = "workout_notes", columnDefinition = "TEXT")
    private String workoutNotes;

    @Column(name = "client_feedback", columnDefinition = "TEXT")
    private String clientFeedback;

    @Column(name = "rating", precision = 2, scale = 1)
    private Double rating; // 1.0 to 5.0

    @Column(name = "price", precision = 10, scale = 2)
    private Double price;

    @Column(name = "cancellation_reason", columnDefinition = "TEXT")
    private String cancellationReason;

    @Column(name = "cancellation_time")
    private LocalDateTime cancellationTime;

    @Column(name = "is_makeup_session")
    private boolean isMakeupSession = false;

    @Column(name = "room_location", length = 100)
    private String roomLocation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private MemberProfile member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trainer_id", nullable = false)
    private TrainerProfile trainer;
}