package com.gym.backend.service;

import com.gym.backend.dto.AttendanceDto;
import com.gym.backend.entity.Attendance;
import com.gym.backend.entity.ClassBooking;
import com.gym.backend.entity.MemberProfile;
import com.gym.backend.entity.PTSession;
import com.gym.backend.entity.enums.VisitType;
import com.gym.backend.exception.ResourceNotFoundException;
import com.gym.backend.exception.BusinessRuleException;
import com.gym.backend.repository.AttendanceRepository;
import com.gym.backend.repository.ClassBookingRepository;
import com.gym.backend.repository.MemberProfileRepository;
import com.gym.backend.repository.PTSessionRepository;
import com.gym.backend.util.DtoMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service for managing gym attendance
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final MemberProfileRepository memberProfileRepository;
    private final ClassBookingRepository classBookingRepository;
    private final PTSessionRepository ptSessionRepository;
    private final DtoMapper dtoMapper;

    /**
     * Check in to the gym
     */
    @Transactional
    public AttendanceDto checkIn(Long memberId) {
        log.info("Member {} checking in", memberId);

        // Validate member
        MemberProfile member = memberProfileRepository.findById(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with ID: " + memberId));

        // Check if member already has an active check-in (no check-out)
        Optional<Attendance> activeCheckIn = attendanceRepository.findActiveCheckIns().stream()
                .filter(att -> att.getMember().getId().equals(memberId))
                .findFirst();

        if (activeCheckIn.isPresent()) {
            throw new BusinessRuleException("Member already checked in and hasn't checked out yet");
        }

        Attendance attendance = new Attendance();
        attendance.setCheckInTime(LocalDateTime.now());
        attendance.setVisitType(VisitType.GENERAL_WORKOUT);
        attendance.setMember(member);

        Attendance savedAttendance = attendanceRepository.save(attendance);
        log.info("Member {} checked in with attendance ID: {}", memberId, savedAttendance.getId());

        return dtoMapper.mapToAttendanceDto(savedAttendance);
    }

    /**
     * Check out from the gym
     */
    @Transactional
    public AttendanceDto checkOut(Long attendanceId) {
        log.info("Checking out with attendance ID: {}", attendanceId);

        Attendance attendance = attendanceRepository.findById(attendanceId)
                .orElseThrow(() -> new ResourceNotFoundException("Attendance record not found with ID: " + attendanceId));

        if (attendance.getCheckOutTime() != null) {
            throw new BusinessRuleException("Member already checked out");
        }

        attendance.setCheckOutTime(LocalDateTime.now());
        Attendance updatedAttendance = attendanceRepository.save(attendance);

        log.info("Member checked out from attendance ID: {}", attendanceId);
        return dtoMapper.mapToAttendanceDto(updatedAttendance);
    }

    /**
     * Check in for a class
     */
    @Transactional
    public AttendanceDto checkInForClass(Long memberId, Long bookingId) {
        log.info("Member {} checking in for class booking {}", memberId, bookingId);

        ClassBooking booking = classBookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Class booking not found with ID: " + bookingId));

        if (!booking.getMember().getId().equals(memberId)) {
            throw new BusinessRuleException("Booking does not belong to the specified member");
        }

        if (booking.getStatus() != com.gym.backend.entity.enums.BookingStatus.CONFIRMED) {
            throw new BusinessRuleException("Can only check in for confirmed bookings");
        }

        Attendance attendance = new Attendance();
        attendance.setCheckInTime(LocalDateTime.now());
        attendance.setVisitType(VisitType.GROUP_CLASS);
        attendance.setMember(booking.getMember());
        attendance.setClassBooking(booking);

        Attendance savedAttendance = attendanceRepository.save(attendance);

        // Mark booking as attended
        booking.setAttended(true);
        booking.setAttendanceTime(LocalDateTime.now());
        classBookingRepository.save(booking);

        log.info("Member {} checked in for class booking {}", memberId, bookingId);
        return dtoMapper.mapToAttendanceDto(savedAttendance);
    }

    /**
     * Check in for personal training session
     */
    @Transactional
    public AttendanceDto checkInForPTSession(Long memberId, Long sessionId) {
        log.info("Member {} checking in for PT session {}", memberId, sessionId);

        PTSession session = ptSessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("PT session not found with ID: " + sessionId));

        if (!session.getMember().getId().equals(memberId)) {
            throw new BusinessRuleException("PT session does not belong to the specified member");
        }

        Attendance attendance = new Attendance();
        attendance.setCheckInTime(LocalDateTime.now());
        attendance.setVisitType(VisitType.PERSONAL_TRAINING);
        attendance.setMember(session.getMember());
        attendance.setPtSession(session);

        Attendance savedAttendance = attendanceRepository.save(attendance);

        log.info("Member {} checked in for PT session {}", memberId, sessionId);
        return dtoMapper.mapToAttendanceDto(savedAttendance);
    }

    /**
     * Get attendance records by member ID
     */
    @Transactional(readOnly = true)
    public List<AttendanceDto> getAttendanceByMember(Long memberId) {
        log.debug("Fetching attendance records for member ID: {}", memberId);
        return attendanceRepository.findByMemberIdOrderByCheckInTimeDesc(memberId).stream()
                .map(dtoMapper::mapToAttendanceDto)
                .collect(Collectors.toList());
    }

    /**
     * Get attendance records by date range
     */
    @Transactional(readOnly = true)
    public List<AttendanceDto> getAttendanceByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        log.debug("Fetching attendance records from {} to {}", startDate, endDate);
        return attendanceRepository.findAttendanceInDateRange(startDate, endDate).stream()
                .map(dtoMapper::mapToAttendanceDto)
                .collect(Collectors.toList());
    }

    /**
     * Get active check-ins
     */
    @Transactional(readOnly = true)
    public List<AttendanceDto> getActiveCheckIns() {
        log.debug("Fetching active check-ins");
        return attendanceRepository.findActiveCheckIns().stream()
                .map(dtoMapper::mapToAttendanceDto)
                .collect(Collectors.toList());
    }

    /**
     * Count attendance for member in date range
     */
    @Transactional(readOnly = true)
    public Long countAttendanceForMemberInRange(Long memberId, LocalDateTime startDate, LocalDateTime endDate) {
        log.debug("Counting attendance for member {} from {} to {}", memberId, startDate, endDate);
        return attendanceRepository.countAttendanceForMemberInDateRange(memberId, startDate, endDate);
    }

    /**
     * Get attendance by ID
     */
    @Transactional(readOnly = true)
    public AttendanceDto getAttendanceById(Long id) {
        log.debug("Fetching attendance record with ID: {}", id);
        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Attendance record not found with ID: " + id));
        return dtoMapper.mapToAttendanceDto(attendance);
    }
}