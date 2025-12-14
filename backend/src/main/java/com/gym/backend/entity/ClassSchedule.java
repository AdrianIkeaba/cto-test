package com.gym.backend.entity;

import com.gym.backend.entity.enums.RecurrencePattern;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashSet;
import java.util.Set;

/**
 * ClassSchedule entity representing scheduled gym classes
 */
@Entity
@Table(name = "class_schedules")
@Data
@EqualsAndHashCode(callSuper = true)
public class ClassSchedule extends BaseEntity {

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalDateTime endTime;

    @Column(name = "current_bookings", nullable = false)
    private Integer currentBookings = 0;

    @Column(name = "room_name", length = 100)
    private String roomName;

    @Column(name = "is_recurring")
    private boolean isRecurring = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "recurrence_pattern")
    private RecurrencePattern recurrencePattern;

    @Column(name = "recurrence_day_of_week")
    private Integer recurrenceDayOfWeek; // 1-7 (Monday-Sunday)

    @Column(name = "recurrence_end_date")
    private LocalDateTime recurrenceEndDate;

    @Column(name = "is_active")
    private boolean isActive = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "gym_class_id", nullable = false)
    private GymClass gymClass;

    @OneToMany(mappedBy = "classSchedule", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<ClassBooking> bookings = new HashSet<>();
}
