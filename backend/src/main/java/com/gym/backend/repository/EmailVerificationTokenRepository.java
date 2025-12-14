package com.gym.backend.repository;

import com.gym.backend.entity.EmailVerificationToken;
import com.gym.backend.entity.enums.EmailVerificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for EmailVerificationToken entity
 */
@Repository
public interface EmailVerificationTokenRepository extends JpaRepository<EmailVerificationToken, Long> {

    /**
     * Find email verification token by token string
     */
    Optional<EmailVerificationToken> findByToken(String token);

    /**
     * Find email verification tokens by user and status
     */
    List<EmailVerificationToken> findByUserIdAndStatus(Long userId, EmailVerificationStatus status);

    /**
     * Find email verification tokens by status
     */
    List<EmailVerificationToken> findByStatus(EmailVerificationStatus status);

    /**
     * Find expired email verification tokens
     */
    @Query("SELECT evt FROM EmailVerificationToken evt WHERE evt.expiresAt < :now")
    List<EmailVerificationToken> findExpiredTokens(@Param("now") LocalDateTime now);

    /**
     * Find valid email verification tokens for a user
     */
    @Query("SELECT evt FROM EmailVerificationToken evt WHERE evt.user.id = :userId " +
           "AND evt.status = 'PENDING' AND evt.expiresAt > :now")
    List<EmailVerificationToken> findValidTokensForUser(@Param("userId") Long userId, 
                                                       @Param("now") LocalDateTime now);

    /**
     * Delete expired email verification tokens
     */
    @Query("DELETE FROM EmailVerificationToken evt WHERE evt.expiresAt < :now")
    void deleteExpiredTokens(@Param("now") LocalDateTime now);

    /**
     * Check if token exists
     */
    boolean existsByToken(String token);
}