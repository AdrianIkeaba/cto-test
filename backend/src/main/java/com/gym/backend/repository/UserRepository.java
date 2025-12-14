package com.gym.backend.repository;

import com.gym.backend.entity.User;
import com.gym.backend.entity.enums.RoleType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

/**
 * Repository interface for User entity
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Find user by email
     */
    Optional<User> findByEmail(String email);

    /**
     * Check if email exists
     */
    boolean existsByEmail(String email);

    /**
     * Find active users
     */
    Page<User> findByActiveTrue(Pageable pageable);

    /**
     * Find users by role
     */
    @Query("SELECT u FROM User u JOIN u.roles r WHERE r.name = :roleType")
    Page<User> findByRole(@Param("roleType") RoleType roleType, Pageable pageable);

    /**
     * Find users by multiple roles
     */
    @Query("SELECT u FROM User u JOIN u.roles r WHERE r.name IN :roleTypes")
    Page<User> findByRolesIn(@Param("roleTypes") Set<RoleType> roleTypes, Pageable pageable);

    /**
     * Find users by email verification status
     */
    Page<User> findByEmailVerified(boolean emailVerified, Pageable pageable);

    /**
     * Find users with email verification token
     */
    @Query("SELECT u FROM User u WHERE u.emailVerificationToken = :token")
    Optional<User> findByEmailVerificationToken(@Param("token") String token);

    /**
     * Find users with password reset token
     */
    @Query("SELECT u FROM User u WHERE u.passwordResetToken = :token")
    Optional<User> findByPasswordResetToken(@Param("token") String token);

    /**
     * Count active users
     */
    @Query("SELECT COUNT(u) FROM User u WHERE u.active = true")
    long countActiveUsers();

    /**
     * Count users by role
     */
    @Query("SELECT COUNT(u) FROM User u JOIN u.roles r WHERE r.name = :roleType AND u.active = true")
    long countByRole(@Param("roleType") RoleType roleType);

    /**
     * Find users who haven't logged in since a specific date
     */
    @Query("SELECT u FROM User u WHERE u.lastLoginAt < :date AND u.active = true")
    List<User> findInactiveUsersSince(@Param("date") java.time.LocalDateTime date);

    /**
     * Search users by name or email
     */
    @Query("SELECT u FROM User u WHERE LOWER(u.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
           "OR LOWER(u.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
           "OR LOWER(u.email) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<User> searchUsers(@Param("searchTerm") String searchTerm, Pageable pageable);
}
