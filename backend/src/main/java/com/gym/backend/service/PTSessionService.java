package com.gym.backend.service;

import com.gym.backend.dto.PTSessionDto;
import com.gym.backend.entity.PTSession;
import com.gym.backend.entity.MemberProfile;
import com.gym.backend.entity.TrainerProfile;
import com.gym.backend.entity.enums.SessionStatus;
import com.gym.backend.entity.enums.SessionType;
import com.gym.backend.exception.ResourceNotFoundException;
import com.gym.backend.exception.BusinessRuleException;
import com.gym.backend.repository.PTSessionRepository;
import com.gym.backend.repository.MemberProfileRepository;
import com.gym.backend.repository.TrainerProfileRepository;
import com.gym.backend.util.DtoMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for managing personal training sessions
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PTSessionService {

    private final PTSessionRepository ptSessionRepository;
    private final MemberProfileRepository memberProfileRepository;
    private final TrainerProfileRepository trainerProfileRepository;
    private final DtoMapper dtoMapper;

    /**
     * Book a personal training session
     */
    @Transactional
    public PTSessionDto bookSession(Long memberId, Long trainerId, LocalDateTime sessionDate, Integer durationMinutes) {
        log.info("Booking PT session for member {} with trainer {} at {}", memberId, trainerId, sessionDate);

        // Validate member
        MemberProfile member = memberProfileRepository.findById(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with ID: " + memberId));

        // Validate trainer
        TrainerProfile trainer = trainerProfileRepository.findById(trainerId)
                .orElseThrow(() -> new ResourceNotFoundException("Trainer not found with ID: " + trainerId));

        // Check if session time is in the future
        if (sessionDate.isBefore(LocalDateTime.now())) {
            throw new BusinessRuleException("Cannot book a session in the past");
        }

        // Check if trainer is available at that time
        List<PTSession> conflictingSessions = ptSessionRepository.findSessionsInDateRange(
                sessionDate.minusMinutes(durationMinutes), sessionDate.plusMinutes(durationMinutes))
                .stream()
                .filter(s -> s.getTrainer().getId().equals(trainerId) &&
                            s.getStatus() != SessionStatus.CANCELLED)
                .collect(Collectors.toList());

        if (!conflictingSessions.isEmpty()) {
            throw new BusinessRuleException("Trainer is not available at the requested time");
        }

        // Create session
        PTSession session = new PTSession();
        session.setSessionDate(sessionDate);
        session.setDurationMinutes(durationMinutes);
        session.setStatus(SessionStatus.SCHEDULED);
        session.setSessionType(SessionType.ONE_ON_ONE_TRAINING);
        session.setMember(member);
        session.setTrainer(trainer);
        if (trainer.getHourlyRate() != null) {
            BigDecimal hourlyRate = trainer.getHourlyRate();
            BigDecimal durationFraction = BigDecimal.valueOf(durationMinutes).divide(BigDecimal.valueOf(60), 2, java.math.RoundingMode.HALF_UP);
            session.setPrice(hourlyRate.multiply(durationFraction));
        } else {
            session.setPrice(null);
        }

        PTSession savedSession = ptSessionRepository.save(session);
        log.info("Created PT session with ID: {}", savedSession.getId());

        return dtoMapper.mapToPTSessionDto(savedSession);
    }

    /**
     * Update PT session status
     */
    @Transactional
    public PTSessionDto updateSessionStatus(Long sessionId, SessionStatus status, String notes) {
        log.info("Updating PT session {} status to {}", sessionId, status);

        PTSession session = ptSessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("PT session not found with ID: " + sessionId));

        session.setStatus(status);

        switch (status) {
            case COMPLETED:
                if (session.getSessionDate().isAfter(LocalDateTime.now())) {
                    throw new BusinessRuleException("Cannot mark a future session as completed");
                }
                break;
            case CANCELLED:
                session.setCancellationTime(LocalDateTime.now());
                session.setCancellationReason(notes);
                break;
            case IN_PROGRESS:
                if (session.getStatus() != SessionStatus.CONFIRMED && session.getStatus() != SessionStatus.SCHEDULED) {
                    throw new BusinessRuleException("Can only start sessions that are scheduled or confirmed");
                }
                break;
        }

        PTSession updatedSession = ptSessionRepository.save(session);
        log.info("Updated PT session status to {}", status);

        return dtoMapper.mapToPTSessionDto(updatedSession);
    }

    /**
     * Add workout notes to a session
     */
    @Transactional
    public PTSessionDto addWorkoutNotes(Long sessionId, String notes, String clientFeedback, BigDecimal rating) {
        log.info("Adding workout notes to PT session {}", sessionId);

        PTSession session = ptSessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("PT session not found with ID: " + sessionId));

        if (session.getStatus() != SessionStatus.COMPLETED) {
            throw new BusinessRuleException("Can only add notes to completed sessions");
        }

        session.setWorkoutNotes(notes);
        session.setClientFeedback(clientFeedback);
        if (rating != null) {
            if (rating.compareTo(BigDecimal.ONE) < 0 || rating.compareTo(BigDecimal.valueOf(5.0)) > 0) {
                throw new BusinessRuleException("Rating must be between 1.0 and 5.0");
            }
            session.setRating(rating);
        }

        PTSession updatedSession = ptSessionRepository.save(session);
        log.info("Added workout notes to PT session {}", sessionId);

        return dtoMapper.mapToPTSessionDto(updatedSession);
    }

    /**
     * Get PT sessions by member ID
     */
    @Transactional(readOnly = true)
    public List<PTSessionDto> getSessionsByMember(Long memberId) {
        log.debug("Fetching PT sessions for member ID: {}", memberId);
        return ptSessionRepository.findByMemberIdOrderBySessionDateDesc(memberId).stream()
                .map(dtoMapper::mapToPTSessionDto)
                .collect(Collectors.toList());
    }

    /**
     * Get PT sessions by trainer ID
     */
    @Transactional(readOnly = true)
    public List<PTSessionDto> getSessionsByTrainer(Long trainerId) {
        log.debug("Fetching PT sessions for trainer ID: {}", trainerId);
        return ptSessionRepository.findByTrainerIdOrderBySessionDateDesc(trainerId).stream()
                .map(dtoMapper::mapToPTSessionDto)
                .collect(Collectors.toList());
    }

    /**
     * Get upcoming sessions for member
     */
    @Transactional(readOnly = true)
    public List<PTSessionDto> getUpcomingSessionsForMember(Long memberId) {
        log.debug("Fetching upcoming PT sessions for member ID: {}", memberId);
        return ptSessionRepository.findUpcomingSessionsForMember(memberId, LocalDateTime.now()).stream()
                .map(dtoMapper::mapToPTSessionDto)
                .collect(Collectors.toList());
    }

    /**
     * Get upcoming sessions for trainer
     */
    @Transactional(readOnly = true)
    public List<PTSessionDto> getUpcomingSessionsForTrainer(Long trainerId) {
        log.debug("Fetching upcoming PT sessions for trainer ID: {}", trainerId);
        return ptSessionRepository.findUpcomingSessionsForTrainer(trainerId, LocalDateTime.now()).stream()
                .map(dtoMapper::mapToPTSessionDto)
                .collect(Collectors.toList());
    }

    /**
     * Get PT session by ID
     */
    @Transactional(readOnly = true)
    public PTSessionDto getPTSessionById(Long id) {
        log.debug("Fetching PT session with ID: {}", id);
        PTSession session = ptSessionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("PT session not found with ID: " + id));
        return dtoMapper.mapToPTSessionDto(session);
    }

    /**
     * Cancel a PT session
     */
    @Transactional
    public PTSessionDto cancelPTSession(Long sessionId, String reason) {
        log.info("Cancelling PT session {}", sessionId);
        return updateSessionStatus(sessionId, SessionStatus.CANCELLED, reason);
    }

    /**
     * Get completed sessions for member
     */
    @Transactional(readOnly = true)
    public List<PTSessionDto> getCompletedSessionsForMember(Long memberId) {
        log.debug("Fetching completed PT sessions for member ID: {}", memberId);
        return ptSessionRepository.findCompletedSessionsForMember(memberId).stream()
                .map(dtoMapper::mapToPTSessionDto)
                .collect(Collectors.toList());
    }

    /**
     * Get average rating for trainer
     */
    @Transactional(readOnly = true)
    public Double getAverageRatingForTrainer(Long trainerId) {
        log.debug("Fetching average rating for trainer ID: {}", trainerId);
        Double avgRating = ptSessionRepository.calculateAverageRatingForTrainer(trainerId);
        return avgRating != null ? avgRating : 0.0;
    }
}
