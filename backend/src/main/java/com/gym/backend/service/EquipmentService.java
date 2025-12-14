package com.gym.backend.service;

import com.gym.backend.dto.EquipmentDto;
import com.gym.backend.entity.Equipment;
import com.gym.backend.entity.enums.EquipmentCategory;
import com.gym.backend.entity.enums.EquipmentStatus;
import com.gym.backend.exception.ResourceNotFoundException;
import com.gym.backend.repository.EquipmentRepository;
import com.gym.backend.util.DtoMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for managing equipment inventory
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class EquipmentService {

    private final EquipmentRepository equipmentRepository;
    private final DtoMapper dtoMapper;

    /**
     * Create new equipment
     */
    @Transactional
    public EquipmentDto createEquipment(EquipmentDto equipmentDto) {
        log.info("Creating new equipment: {}", equipmentDto.getName());

        Equipment equipment = dtoMapper.mapToEquipment(equipmentDto);
        equipment.setStatus(EquipmentStatus.ACTIVE);
        equipment.setActive(true);

        Equipment savedEquipment = equipmentRepository.save(equipment);
        log.info("Created equipment with ID: {}", savedEquipment.getId());

        return dtoMapper.mapToEquipmentDto(savedEquipment);
    }

    /**
     * Update equipment
     */
    @Transactional
    public EquipmentDto updateEquipment(Long id, EquipmentDto equipmentDto) {
        log.info("Updating equipment with ID: {}", id);

        Equipment existingEquipment = equipmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Equipment not found with ID: " + id));

        existingEquipment.setName(equipmentDto.getName());
        existingEquipment.setDescription(equipmentDto.getDescription());
        existingEquipment.setEquipmentCode(equipmentDto.getEquipmentCode());
        existingEquipment.setCategory(equipmentDto.getCategory());
        existingEquipment.setBrand(equipmentDto.getBrand());
        existingEquipment.setModel(equipmentDto.getModel());
        existingEquipment.setSerialNumber(equipmentDto.getSerialNumber());
        existingEquipment.setPurchaseDate(equipmentDto.getPurchaseDate());
        existingEquipment.setPurchasePrice(equipmentDto.getPurchasePrice());
        existingEquipment.setWarrantyExpiryDate(equipmentDto.getWarrantyExpiryDate());
        existingEquipment.setMaintenanceDate(equipmentDto.getMaintenanceDate());
        existingEquipment.setNextMaintenanceDate(equipmentDto.getNextMaintenanceDate());
        existingEquipment.setStatus(equipmentDto.getStatus());
        existingEquipment.setLocation(equipmentDto.getLocation());

        Equipment updatedEquipment = equipmentRepository.save(existingEquipment);
        log.info("Updated equipment with ID: {}", updatedEquipment.getId());

        return dtoMapper.mapToEquipmentDto(updatedEquipment);
    }

    /**
     * Delete equipment (soft delete)
     */
    @Transactional
    public void deleteEquipment(Long id) {
        log.info("Deleting equipment with ID: {}", id);

        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Equipment not found with ID: " + id));

        equipment.setActive(false);
        equipmentRepository.save(equipment);

        log.info("Soft deleted equipment with ID: {}", id);
    }

    /**
     * Get all equipment
     */
    @Transactional(readOnly = true)
    public List<EquipmentDto> getAllEquipment() {
        log.debug("Fetching all equipment");
        return equipmentRepository.findAll().stream()
                .map(dtoMapper::mapToEquipmentDto)
                .collect(Collectors.toList());
    }

    /**
     * Get equipment by ID
     */
    @Transactional(readOnly = true)
    public EquipmentDto getEquipmentById(Long id) {
        log.debug("Fetching equipment with ID: {}", id);
        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Equipment not found with ID: " + id));
        return dtoMapper.mapToEquipmentDto(equipment);
    }

    /**
     * Get equipment by category
     */
    @Transactional(readOnly = true)
    public List<EquipmentDto> getEquipmentByCategory(EquipmentCategory category) {
        log.debug("Fetching equipment by category: {}", category);
        return equipmentRepository.findByCategoryAndActiveTrue(category).stream()
                .map(dtoMapper::mapToEquipmentDto)
                .collect(Collectors.toList());
    }

    /**
     * Get equipment by status
     */
    @Transactional(readOnly = true)
    public List<EquipmentDto> getEquipmentByStatus(EquipmentStatus status) {
        log.debug("Fetching equipment by status: {}", status);
        return equipmentRepository.findByStatusAndActiveTrue(status).stream()
                .map(dtoMapper::mapToEquipmentDto)
                .collect(Collectors.toList());
    }

    /**
     * Get equipment requiring maintenance
     */
    @Transactional(readOnly = true)
    public List<EquipmentDto> getEquipmentRequiringMaintenance() {
        log.debug("Fetching equipment requiring maintenance");
        LocalDate currentDate = LocalDate.now();
        return equipmentRepository.findEquipmentRequiringMaintenance(currentDate).stream()
                .map(dtoMapper::mapToEquipmentDto)
                .collect(Collectors.toList());
    }

    /**
     * Update equipment maintenance date
     */
    @Transactional
    public EquipmentDto updateMaintenanceDate(Long id, LocalDate nextMaintenanceDate) {
        log.info("Updating maintenance date for equipment ID: {}", id);

        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Equipment not found with ID: " + id));

        equipment.setMaintenanceDate(LocalDate.now());
        equipment.setNextMaintenanceDate(nextMaintenanceDate);

        Equipment updatedEquipment = equipmentRepository.save(equipment);
        log.info("Updated maintenance date for equipment ID: {}", id);

        return dtoMapper.mapToEquipmentDto(updatedEquipment);
    }

    /**
     * Mark equipment as out of order
     */
    @Transactional
    public EquipmentDto markEquipmentOutOfOrder(Long id, String reason) {
        log.info("Marking equipment as out of order: {}", id);

        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Equipment not found with ID: " + id));

        equipment.setStatus(EquipmentStatus.OUT_OF_ORDER);
        equipment.setDescription(equipment.getDescription() + "\nOut of order: " + reason);

        Equipment updatedEquipment = equipmentRepository.save(equipment);
        log.info("Marked equipment as out of order: {}", id);

        return dtoMapper.mapToEquipmentDto(updatedEquipment);
    }
}
