package com.gym.backend.service;

import com.gym.backend.dto.GymClassDto;
import com.gym.backend.entity.GymClass;
import com.gym.backend.entity.TrainerProfile;
import com.gym.backend.entity.enums.ClassCategory;
import com.gym.backend.entity.enums.ClassDifficulty;
import com.gym.backend.exception.ResourceNotFoundException;
import com.gym.backend.repository.GymClassRepository;
import com.gym.backend.repository.TrainerProfileRepository;
import com.gym.backend.util.DtoMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service for managing gym classes
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class GymClassService {

    private final GymClassRepository gymClassRepository;
    private final TrainerProfileRepository trainerProfileRepository;
    private final DtoMapper dtoMapper;

    /**
     * Create a new gym class
     */
    @Transactional
    public GymClassDto createGymClass(GymClassDto gymClassDto) {
        log.info("Creating new gym class: {}", gymClassDto.getName());

        GymClass gymClass = dtoMapper.mapToGymClass(gymClassDto);
        
        // Validate trainer if specified
        if (gymClassDto.getTrainerId() != null) {
            TrainerProfile trainer = trainerProfileRepository.findById(gymClassDto.getTrainerId())
                .orElseThrow(() -> new ResourceNotFoundException("Trainer not found with ID: " + gymClassDto.getTrainerId()));
            gymClass.setTrainer(trainer);
        }

        GymClass savedGymClass = gymClassRepository.save(gymClass);
        log.info("Created gym class with ID: {}", savedGymClass.getId());

        return dtoMapper.mapToGymClassDto(savedGymClass);
    }

    /**
     * Get all gym classes
     */
    @Transactional(readOnly = true)
    public List<GymClassDto> getAllGymClasses() {
        log.debug("Fetching all gym classes");
        return gymClassRepository.findAll().stream()
                .map(dtoMapper::mapToGymClassDto)
                .collect(Collectors.toList());
    }

    /**
     * Get gym class by ID
     */
    @Transactional(readOnly = true)
    public GymClassDto getGymClassById(Long id) {
        log.debug("Fetching gym class with ID: {}", id);
        GymClass gymClass = gymClassRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Gym class not found with ID: " + id));
        return dtoMapper.mapToGymClassDto(gymClass);
    }

    /**
     * Update gym class
     */
    @Transactional
    public GymClassDto updateGymClass(Long id, GymClassDto gymClassDto) {
        log.info("Updating gym class with ID: {}", id);

        GymClass existingGymClass = gymClassRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Gym class not found with ID: " + id));

        // Update fields
        existingGymClass.setName(gymClassDto.getName());
        existingGymClass.setDescription(gymClassDto.getDescription());
        existingGymClass.setDurationMinutes(gymClassDto.getDurationMinutes());
        existingGymClass.setMaxCapacity(gymClassDto.getMaxCapacity());
        existingGymClass.setDifficultyLevel(gymClassDto.getDifficultyLevel());
        existingGymClass.setCategory(gymClassDto.getCategory());
        existingGymClass.setActive(gymClassDto.isActive());
        existingGymClass.setPrice(gymClassDto.getPrice());

        // Update trainer if specified
        if (gymClassDto.getTrainerId() != null) {
            TrainerProfile trainer = trainerProfileRepository.findById(gymClassDto.getTrainerId())
                .orElseThrow(() -> new ResourceNotFoundException("Trainer not found with ID: " + gymClassDto.getTrainerId()));
            existingGymClass.setTrainer(trainer);
        }

        GymClass updatedGymClass = gymClassRepository.save(existingGymClass);
        log.info("Updated gym class with ID: {}", updatedGymClass.getId());

        return dtoMapper.mapToGymClassDto(updatedGymClass);
    }

    /**
     * Delete gym class
     */
    @Transactional
    public void deleteGymClass(Long id) {
        log.info("Deleting gym class with ID: {}", id);
        
        GymClass gymClass = gymClassRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Gym class not found with ID: " + id));
        
        // Soft delete - set inactive
        gymClass.setActive(false);
        gymClassRepository.save(gymClass);
        
        log.info("Soft deleted gym class with ID: {}", id);
    }

    /**
     * Get active gym classes
     */
    @Transactional(readOnly = true)
    public List<GymClassDto> getActiveGymClasses() {
        log.debug("Fetching active gym classes");
        return gymClassRepository.findByIsActiveTrue().stream()
                .map(dtoMapper::mapToGymClassDto)
                .collect(Collectors.toList());
    }

    /**
     * Get gym classes by category
     */
    @Transactional(readOnly = true)
    public List<GymClassDto> getGymClassesByCategory(ClassCategory category) {
        log.debug("Fetching gym classes by category: {}", category);
        return gymClassRepository.findByCategoryAndIsActiveTrue(category).stream()
                .map(dtoMapper::mapToGymClassDto)
                .collect(Collectors.toList());
    }

    /**
     * Get gym classes by difficulty level
     */
    @Transactional(readOnly = true)
    public List<GymClassDto> getGymClassesByDifficulty(ClassDifficulty difficulty) {
        log.debug("Fetching gym classes by difficulty: {}", difficulty);
        return gymClassRepository.findByDifficultyLevelAndIsActiveTrue(difficulty).stream()
                .map(dtoMapper::mapToGymClassDto)
                .collect(Collectors.toList());
    }

    /**
     * Get gym classes by trainer ID
     */
    @Transactional(readOnly = true)
    public List<GymClassDto> getGymClassesByTrainer(Long trainerId) {
        log.debug("Fetching gym classes for trainer ID: {}", trainerId);
        return gymClassRepository.findByTrainerIdAndIsActive(trainerId).stream()
                .map(dtoMapper::mapToGymClassDto)
                .collect(Collectors.toList());
    }

    /**
     * Search gym classes by name
     */
    @Transactional(readOnly = true)
    public List<GymClassDto> searchGymClassesByName(String name) {
        log.debug("Searching gym classes by name: {}", name);
        return gymClassRepository.findByNameContainingIgnoreCaseAndIsActiveTrue(name).stream()
                .map(dtoMapper::mapToGymClassDto)
                .collect(Collectors.toList());
    }
}