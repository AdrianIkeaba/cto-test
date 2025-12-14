package com.gym.backend.service;

import com.gym.backend.dto.ClassBookingDto;
import com.gym.backend.entity.ClassBooking;
import com.gym.backend.entity.ClassSchedule;
import com.gym.backend.entity.MemberProfile;
import com.gym.backend.entity.enums.BookingStatus;
import com.gym.backend.exception.ResourceNotFoundException;
import com.gym.backend.exception.BusinessRuleException;
import com.gym.backend.repository.ClassBookingRepository;
import com.gym.backend.repository.ClassScheduleRepository;
import com.gym.backend.repository.MemberProfileRepository;
import com.gym.backend.util.DtoMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service for managing class bookings
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ClassBookingService {

    private final ClassBookingRepository classBookingRepository;
    private final ClassScheduleRepository classScheduleRepository;
    private final MemberProfileRepository memberProfileRepository;
    private final DtoMapper dtoMapper;

    /**
     * Book a class for a member
     */
    @Transactional
    public ClassBookingDto bookClass(Long memberId, Long scheduleId) {
        log.info("Creating booking for member ID: {} and schedule ID: {}", memberId, scheduleId);

        // Validate member
        MemberProfile member = memberProfileRepository.findById(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with ID: " + memberId));

        // Validate schedule
        ClassSchedule schedule = classScheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new ResourceNotFoundException("Class schedule not found with ID: " + scheduleId));

        // Check if schedule is active and in the future
        if (!schedule.isActive()) {
            throw new BusinessRuleException("Cannot book an inactive class schedule");
        }

        if (schedule.getStartTime().isBefore(LocalDateTime.now())) {
            throw new BusinessRuleException("Cannot book a past class");
        }

        // Check capacity
        if (schedule.getCurrentBookings() >= schedule.getGymClass().getMaxCapacity()) {
            throw new BusinessRuleException("Class is fully booked");
        }

        // Check if member already has a booking for this schedule
        List<ClassBooking> existingBookings = classBookingRepository
                .findMemberBookingsForScheduleAndTime(memberId, scheduleId, schedule.getStartTime());
        
        if (!existingBookings.isEmpty()) {
            throw new BusinessRuleException("Member already has a booking for this class");
        }

        // Create booking
        ClassBooking booking = new ClassBooking();
        booking.setBookingReference(generateBookingReference());
        booking.setStatus(BookingStatus.CONFIRMED);
        booking.setBookingDate(LocalDateTime.now());
        booking.setMember(member);
        booking.setClassSchedule(schedule);
        booking.setAmountPaid(schedule.getGymClass().getPrice());

        // Update schedule current bookings
        schedule.setCurrentBookings(schedule.getCurrentBookings() + 1);

        ClassBooking savedBooking = classBookingRepository.save(booking);
        classScheduleRepository.save(schedule);

        log.info("Created booking with reference: {}", savedBooking.getBookingReference());

        return dtoMapper.mapToClassBookingDto(savedBooking);
    }

    /**
     * Cancel a class booking
     */
    @Transactional
    public ClassBookingDto cancelBooking(Long bookingId, String reason) {
        log.info("Cancelling booking with ID: {}", bookingId);

        ClassBooking booking = classBookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BusinessRuleException("Booking is already cancelled");
        }

        if (booking.getStatus() == BookingStatus.COMPLETED) {
            throw new BusinessRuleException("Cannot cancel a completed booking");
        }

        // Update booking status
        booking.setStatus(BookingStatus.CANCELLED);
        booking.setCancellationReason(reason);
        booking.setCancellationDate(LocalDateTime.now());

        // Update schedule current bookings
        ClassSchedule schedule = booking.getClassSchedule();
        schedule.setCurrentBookings(Math.max(0, schedule.getCurrentBookings() - 1));

        classBookingRepository.save(booking);
        classScheduleRepository.save(schedule);

        log.info("Cancelled booking with ID: {}", bookingId);

        return dtoMapper.mapToClassBookingDto(booking);
    }

    /**
     * Mark booking as attended
     */
    @Transactional
    public ClassBookingDto markBookingAsAttended(Long bookingId) {
        log.info("Marking booking as attended: {}", bookingId);

        ClassBooking booking = classBookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));

        if (booking.getStatus() != BookingStatus.CONFIRMED) {
            throw new BusinessRuleException("Can only mark confirmed bookings as attended");
        }

        booking.setAttended(true);
        booking.setAttendanceTime(LocalDateTime.now());
        booking.setStatus(BookingStatus.COMPLETED);

        ClassBooking updatedBooking = classBookingRepository.save(booking);

        log.info("Marked booking as attended: {}", bookingId);

        return dtoMapper.mapToClassBookingDto(updatedBooking);
    }

    /**
     * Get bookings by member ID
     */
    @Transactional(readOnly = true)
    public List<ClassBookingDto> getBookingsByMember(Long memberId) {
        log.debug("Fetching bookings for member ID: {}", memberId);
        return classBookingRepository.findByMemberIdOrderByBookingDateDesc(memberId).stream()
                .map(dtoMapper::mapToClassBookingDto)
                .collect(Collectors.toList());
    }

    /**
     * Get upcoming bookings for member
     */
    @Transactional(readOnly = true)
    public List<ClassBookingDto> getUpcomingBookingsForMember(Long memberId) {
        log.debug("Fetching upcoming bookings for member ID: {}", memberId);
        return classBookingRepository.findUpcomingBookingsForMember(memberId, LocalDateTime.now()).stream()
                .map(dtoMapper::mapToClassBookingDto)
                .collect(Collectors.toList());
    }

    /**
     * Get bookings by schedule ID
     */
    @Transactional(readOnly = true)
    public List<ClassBookingDto> getBookingsBySchedule(Long scheduleId) {
        log.debug("Fetching bookings for schedule ID: {}", scheduleId);
        ClassSchedule schedule = classScheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new ResourceNotFoundException("Class schedule not found with ID: " + scheduleId));

        return classBookingRepository.findByClassScheduleIdAndStatus(schedule, BookingStatus.CONFIRMED).stream()
                .map(dtoMapper::mapToClassBookingDto)
                .collect(Collectors.toList());
    }

    /**
     * Get all bookings
     */
    @Transactional(readOnly = true)
    public List<ClassBookingDto> getAllBookings() {
        log.debug("Fetching all bookings");
        return classBookingRepository.findAll().stream()
                .map(dtoMapper::mapToClassBookingDto)
                .collect(Collectors.toList());
    }

    /**
     * Generate unique booking reference
     */
    private String generateBookingReference() {
        return "BK" + UUID.randomUUID().toString().replace("-", "").substring(0, 8).toUpperCase();
    }
}