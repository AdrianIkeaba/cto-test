package com.gym.backend.repository;

import com.gym.backend.entity.Equipment;
import com.gym.backend.entity.enums.EquipmentCategory;
import com.gym.backend.entity.enums.EquipmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * Repository for Equipment entities
 */
@Repository
public interface EquipmentRepository extends JpaRepository<Equipment, Long> {

    /**
     * Find equipment by category
     */
    List<Equipment> findByCategoryAndActiveTrue(EquipmentCategory category);

    /**
     * Find equipment by status
     */
    List<Equipment> findByStatusAndActiveTrue(EquipmentStatus status);

    /**
     * Find equipment by location
     */
    List<Equipment> findByLocationAndActiveTrue(String location);

    /**
     * Find equipment requiring maintenance
     */
    @Query("SELECT e FROM Equipment e WHERE e.nextMaintenanceDate <= :currentDate AND e.status = 'ACTIVE' AND e.active = true")
    List<Equipment> findEquipmentRequiringMaintenance(@Param("currentDate") LocalDate currentDate);

    /**
     * Find equipment by equipment code
     */
    Equipment findByEquipmentCode(String equipmentCode);

    /**
     * Find active equipment with warranty expiring soon
     */
    @Query("SELECT e FROM Equipment e WHERE e.warrantyExpiryDate BETWEEN :currentDate AND :expiryDate AND e.active = true")
    List<Equipment> findEquipmentWithWarrantyExpiringSoon(@Param("currentDate") LocalDate currentDate, @Param("expiryDate") LocalDate expiryDate);
}
