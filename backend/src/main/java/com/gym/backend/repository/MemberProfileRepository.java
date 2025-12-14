package com.gym.backend.repository;

import com.gym.backend.entity.MemberProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for MemberProfile entity
 */
@Repository
public interface MemberProfileRepository extends JpaRepository<MemberProfile, Long> {

    /**
     * Find member profile by user ID
     */
    Optional<MemberProfile> findByUserId(Long userId);

    /**
     * Find member profiles by membership type
     */
    List<MemberProfile> findByMembershipType(String membershipType);

    /**
     * Find active member profiles with membership ending in the future
     */
    @Query("SELECT mp FROM MemberProfile mp WHERE mp.membershipEndDate > CURRENT_DATE")
    List<MemberProfile> findActiveMemberProfiles();

    /**
     * Find member profiles with membership ending before a specific date
     */
    @Query("SELECT mp FROM MemberProfile mp WHERE mp.membershipEndDate < :date")
    List<MemberProfile> findExpiringMemberProfiles(@Param("date") java.time.LocalDate date);

    /**
     * Count member profiles by membership type
     */
    @Query("SELECT COUNT(mp) FROM MemberProfile mp WHERE mp.membershipType = :type")
    long countByMembershipType(@Param("type") String membershipType);

    /**
     * Check if user has a member profile
     */
    boolean existsByUserId(Long userId);
}