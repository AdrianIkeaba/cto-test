package com.gym.backend.repository;

import com.gym.backend.entity.PasswordResetToken;
import com.gym.backend.entity.enums.PasswordResetStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for PasswordResetToken entity
 */
@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    /**
     * Find password reset token by token string
     */
    Optional<PasswordResetToken> findByToken(String token);

    /**
     * Find password reset tokens by user and status
     */
    List<PasswordResetToken> findByUserIdAndStatus(Long userId, PasswordResetStatus status);

    /**
     * Find password reset tokens by status
     */
    List<PasswordResetToken> findByStatus(PasswordResetStatus status);

    /**
     * Find expired password reset tokens
     */
    @Query("SELECT prt FROM PasswordResetToken prt WHERE prt.expiresAt < :now")
    List<PasswordResetToken> findExpiredTokens(@Param("now") LocalDateTime now);

    /**
     * Find valid password reset tokens for a user
     */
    @Query("SELECT prt FROM PasswordResetToken prt WHERE prt.user.id = :userId " +
           "AND prt.status = 'PENDING' AND prt.expiresAt > :now")
    List<PasswordResetToken> findValidTokensForUser(@Param("userId") Long userId, 
                                                   @Param("now") LocalDateTime now);

    /**
     * Delete expired password reset tokens
     */
    @Query("DELETE FROM PasswordResetToken prt WHERE prt.expiresAt < :now")
    void deleteExpiredTokens(@Param("now") LocalDateTime now);

    /**
     * Check if token exists
     */
    boolean existsByToken(String token);
}