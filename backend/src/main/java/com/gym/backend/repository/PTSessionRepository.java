package com.gym.backend.repository;

import com.gym.backend.entity.PTSession;
import com.gym.backend.entity.enums.SessionStatus;
import com.gym.backend.entity.enums.SessionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository for PTSession entities
 */
@Repository
public interface PTSessionRepository extends JpaRepository<PTSession, Long> {

    /**
     * Find sessions by member
     */
    List<PTSession> findByMemberIdOrderBySessionDateDesc(Long memberId);

    /**
     * Find sessions by trainer
     */
    List<PTSession> findByTrainerIdOrderBySessionDateDesc(Long trainerId);

    /**
     * Find sessions by status
     */
    List<PTSession> findByStatus(SessionStatus status);

    /**
     * Find sessions by type
     */
    List<PTSession> findBySessionType(SessionType sessionType);

    /**
     * Find upcoming sessions for member
     */
    @Query("SELECT pts FROM PTSession pts WHERE pts.member.id = :memberId AND pts.sessionDate > :currentTime AND pts.status IN ('SCHEDULED', 'CONFIRMED') ORDER BY pts.sessionDate")
    List<PTSession> findUpcomingSessionsForMember(@Param("memberId") Long memberId, @Param("currentTime") LocalDateTime currentTime);

    /**
     * Find upcoming sessions for trainer
     */
    @Query("SELECT pts FROM PTSession pts WHERE pts.trainer.id = :trainerId AND pts.sessionDate > :currentTime AND pts.status IN ('SCHEDULED', 'CONFIRMED') ORDER BY pts.sessionDate")
    List<PTSession> findUpcomingSessionsForTrainer(@Param("trainerId") Long trainerId, @Param("currentTime") LocalDateTime currentTime);

    /**
     * Find sessions by date range
     */
    @Query("SELECT pts FROM PTSession pts WHERE pts.sessionDate >= :startDate AND pts.sessionDate <= :endDate ORDER BY pts.sessionDate")
    List<PTSession> findSessionsInDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    /**
     * Find completed sessions for member
     */
    @Query("SELECT pts FROM PTSession pts WHERE pts.member.id = :memberId AND pts.status = 'COMPLETED' ORDER BY pts.sessionDate DESC")
    List<PTSession> findCompletedSessionsForMember(@Param("memberId") Long memberId);

    /**
     * Calculate average rating for trainer
     */
    @Query("SELECT AVG(pts.rating) FROM PTSession pts WHERE pts.trainer.id = :trainerId AND pts.rating IS NOT NULL")
    Double calculateAverageRatingForTrainer(@Param("trainerId") Long trainerId);
}