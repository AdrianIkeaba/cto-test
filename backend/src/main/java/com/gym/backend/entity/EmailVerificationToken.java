package com.gym.backend.entity;

import com.gym.backend.entity.enums.EmailVerificationStatus;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

/**
 * Email verification token entity for email verification functionality
 */
@Entity
@Table(name = "email_verification_tokens")
@Data
@EqualsAndHashCode(callSuper = true)
public class EmailVerificationToken extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "token", unique = true, nullable = false, length = 255)
    private String token;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private EmailVerificationStatus status = EmailVerificationStatus.PENDING;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;
}