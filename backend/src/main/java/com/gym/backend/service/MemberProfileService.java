package com.gym.backend.service;

import com.gym.backend.dto.MemberDto;
import com.gym.backend.dto.MemberProfileDto;
import com.gym.backend.entity.MemberProfile;
import com.gym.backend.entity.User;
import com.gym.backend.exception.ResourceNotFoundException;
import com.gym.backend.repository.MemberProfileRepository;
import com.gym.backend.repository.UserRepository;
import com.gym.backend.util.DtoMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for managing member profiles
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class MemberProfileService {

    private final MemberProfileRepository memberProfileRepository;
    private final UserRepository userRepository;
    private final DtoMapper dtoMapper;

    /**
     * Get member profile by user ID
     */
    @Transactional(readOnly = true)
    public MemberProfileDto getMemberProfileByUserId(Long userId) {
        log.debug("Fetching member profile for user ID: {}", userId);
        MemberProfile memberProfile = memberProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Member profile not found for user ID: " + userId));
        return dtoMapper.mapToMemberProfileDto(memberProfile);
    }

    /**
     * Get member profile by ID
     */
    @Transactional(readOnly = true)
    public MemberProfileDto getMemberProfileById(Long id) {
        log.debug("Fetching member profile with ID: {}", id);
        MemberProfile memberProfile = memberProfileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Member profile not found with ID: " + id));
        return dtoMapper.mapToMemberProfileDto(memberProfile);
    }

    /**
     * Update member profile
     */
    @Transactional
    public MemberDto updateMemberProfile(Long id, MemberDto memberDto) {
        log.info("Updating member profile with ID: {}", id);

        MemberProfile existingProfile = memberProfileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Member profile not found with ID: " + id));

        // Update member profile fields
        existingProfile.setEmergencyContactName(memberDto.getEmergencyContactName());
        existingProfile.setEmergencyContactPhone(memberDto.getEmergencyContactPhone());
        existingProfile.setMedicalConditions(memberDto.getMedicalConditions());
        existingProfile.setFitnessGoals(memberDto.getFitnessGoals());
        existingProfile.setPreferredTrainingTime(memberDto.getPreferredWorkoutTimes());
        existingProfile.setMembershipType("GOLD"); // This should be dynamic based on subscription

        MemberProfile updatedProfile = memberProfileRepository.save(existingProfile);

        // Update user fields
        User user = updatedProfile.getUser();
        user.setFirstName(memberDto.getUser().getFirstName());
        user.setLastName(memberDto.getUser().getLastName());
        user.setPhoneNumber(memberDto.getUser().getPhoneNumber());
        user.setDateOfBirth(memberDto.getUser().getDateOfBirth());
        userRepository.save(user);

        log.info("Updated member profile with ID: {}", id);
        return dtoMapper.mapToUserDto(user);
    }

    /**
     * Create member profile
     */
    @Transactional
    public MemberProfileDto createMemberProfile(MemberProfileDto profileDto) {
        log.info("Creating member profile for user ID: {}", profileDto.getUserId());

        User user = userRepository.findById(profileDto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + profileDto.getUserId()));

        MemberProfile memberProfile = dtoMapper.mapToMemberProfile(profileDto);
        memberProfile.setUser(user);

        MemberProfile savedProfile = memberProfileRepository.save(memberProfile);
        log.info("Created member profile with ID: {}", savedProfile.getId());

        return dtoMapper.mapToMemberProfileDto(savedProfile);
    }

    /**
     * Get all member profiles
     */
    @Transactional(readOnly = true)
    public List<MemberProfileDto> getAllMemberProfiles() {
        log.debug("Fetching all member profiles");
        return memberProfileRepository.findAll().stream()
                .map(dtoMapper::mapToMemberProfileDto)
                .collect(Collectors.toList());
    }

    /**
     * Get active member profiles
     */
    @Transactional(readOnly = true)
    public List<MemberProfileDto> getActiveMemberProfiles() {
        log.debug("Fetching active member profiles");
        return memberProfileRepository.findByIsActiveTrue().stream()
                .map(dtoMapper::mapToMemberProfileDto)
                .collect(Collectors.toList());
    }
}