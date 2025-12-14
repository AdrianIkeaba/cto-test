package com.gym.backend.entity;

import com.gym.backend.entity.enums.EmailVerificationStatus;
import com.gym.backend.entity.enums.PasswordResetStatus;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * User entity representing system users
 */
@Entity
@Table(name = "users")
@Data
@EqualsAndHashCode(callSuper = true)
public class User extends BaseEntity {

    @Column(name = "email", unique = true, nullable = false, length = 255)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;

    @Column(name = "phone_number", length = 20)
    private String phoneNumber;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "is_active")
    private boolean isActive = true;

    @Column(name = "is_email_verified")
    private boolean isEmailVerified = false;

    @Column(name = "email_verification_token", length = 255)
    private String emailVerificationToken;

    @Column(name = "email_verification_expires_at")
    private LocalDateTime emailVerificationExpiresAt;

    @Column(name = "password_reset_token", length = 255)
    private String passwordResetToken;

    @Column(name = "password_reset_expires_at")
    private LocalDateTime passwordResetExpiresAt;

    @Column(name = "password_reset_attempts")
    private Integer passwordResetAttempts = 0;

    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "user_roles",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private MemberProfile memberProfile;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private TrainerProfile trainerProfile;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private StaffProfile staffProfile;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<EmailVerificationToken> emailVerificationTokens = new HashSet<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<PasswordResetToken> passwordResetTokens = new HashSet<>();

    /**
     * Check if user has a specific role
     */
    public boolean hasRole(RoleType roleType) {
        return roles.stream()
            .anyMatch(role -> role.getName() == roleType);
    }

    /**
     * Check if user has any of the specified roles
     */
    public boolean hasAnyRole(RoleType... roleTypes) {
        Set<RoleType> userRoleTypes = roles.stream()
            .map(Role::getName)
            .collect(java.util.stream.Collectors.toSet());
        
        for (RoleType roleType : roleTypes) {
            if (userRoleTypes.contains(roleType)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Check if user is an admin
     */
    public boolean isAdmin() {
        return hasRole(RoleType.ADMIN);
    }

    /**
     * Check if user is a member
     */
    public boolean isMember() {
        return hasRole(RoleType.MEMBER);
    }

    /**
     * Check if user is a trainer
     */
    public boolean isTrainer() {
        return hasRole(RoleType.TRAINER);
    }

    /**
     * Check if user is staff (admin or staff member)
     */
    public boolean isStaff() {
        return hasAnyRole(RoleType.ADMIN, RoleType.STAFF);
    }

    /**
     * Get full name
     */
    public String getFullName() {
        return firstName + " " + lastName;
    }
}