package com.gym.backend.controller;

import com.gym.backend.dto.GymClassDto;
import com.gym.backend.dto.MembershipPlanDto;
import com.gym.backend.dto.EquipmentDto;
import com.gym.backend.dto.analytics.RevenueAnalyticsDto;
import com.gym.backend.dto.analytics.UtilizationAnalyticsDto;
import com.gym.backend.entity.enums.ClassCategory;
import com.gym.backend.entity.enums.ClassDifficulty;
import com.gym.backend.entity.enums.EquipmentCategory;
import com.gym.backend.entity.enums.EquipmentStatus;
import com.gym.backend.security.UserPrincipal;
import com.gym.backend.service.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Admin controller for gym management operations
 */
@Slf4j
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Tag(name = "Admin", description = "Admin operations for gym management")
@SecurityRequirement(name = "bearer-jwt")
public class AdminController {

    private final GymClassService gymClassService;
    private final MembershipPlanService membershipPlanService;
    private final EquipmentService equipmentService;
    private final AnalyticsService analyticsService;

    // Gym Classes Management
    @GetMapping("/classes")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    @Operation(summary = "Get all gym classes", description = "Retrieve all gym classes (admin/staff only)")
    public ResponseEntity<List<GymClassDto>> getAllGymClasses() {
        log.info("Admin: Fetching all gym classes");
        List<GymClassDto> classes = gymClassService.getAllGymClasses();
        return ResponseEntity.ok(classes);
    }

    @PostMapping("/classes")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create new gym class", description = "Create a new gym class")
    public ResponseEntity<GymClassDto> createGymClass(@RequestBody GymClassDto gymClassDto) {
        log.info("Admin: Creating new gym class: {}", gymClassDto.getName());
        GymClassDto created = gymClassService.createGymClass(gymClassDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/classes/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update gym class", description = "Update an existing gym class")
    public ResponseEntity<GymClassDto> updateGymClass(@PathVariable Long id, @RequestBody GymClassDto gymClassDto) {
        log.info("Admin: Updating gym class with ID: {}", id);
        GymClassDto updated = gymClassService.updateGymClass(id, gymClassDto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/classes/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete gym class", description = "Soft delete a gym class")
    public ResponseEntity<Void> deleteGymClass(@PathVariable Long id) {
        log.info("Admin: Deleting gym class with ID: {}", id);
        gymClassService.deleteGymClass(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/classes/category/{category}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    @Operation(summary = "Get classes by category", description = "Retrieve gym classes by category")
    public ResponseEntity<List<GymClassDto>> getClassesByCategory(@PathVariable ClassCategory category) {
        log.info("Admin: Fetching gym classes by category: {}", category);
        List<GymClassDto> classes = gymClassService.getGymClassesByCategory(category);
        return ResponseEntity.ok(classes);
    }

    @GetMapping("/classes/difficulty/{difficulty}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    @Operation(summary = "Get classes by difficulty", description = "Retrieve gym classes by difficulty level")
    public ResponseEntity<List<GymClassDto>> getClassesByDifficulty(@PathVariable ClassDifficulty difficulty) {
        log.info("Admin: Fetching gym classes by difficulty: {}", difficulty);
        List<GymClassDto> classes = gymClassService.getGymClassesByDifficulty(difficulty);
        return ResponseEntity.ok(classes);
    }

    // Equipment Management
    @GetMapping("/equipment")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    @Operation(summary = "Get all equipment", description = "Retrieve all gym equipment")
    public ResponseEntity<List<EquipmentDto>> getAllEquipment() {
        log.info("Admin: Fetching all equipment");
        List<EquipmentDto> equipment = equipmentService.getAllEquipment();
        return ResponseEntity.ok(equipment);
    }

    @PostMapping("/equipment")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create new equipment", description = "Add new equipment to inventory")
    public ResponseEntity<EquipmentDto> createEquipment(@RequestBody EquipmentDto equipmentDto) {
        log.info("Admin: Creating new equipment: {}", equipmentDto.getName());
        EquipmentDto created = equipmentService.createEquipment(equipmentDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/equipment/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update equipment", description = "Update equipment information")
    public ResponseEntity<EquipmentDto> updateEquipment(@PathVariable Long id, @RequestBody EquipmentDto equipmentDto) {
        log.info("Admin: Updating equipment with ID: {}", id);
        EquipmentDto updated = equipmentService.updateEquipment(id, equipmentDto);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/equipment/category/{category}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    @Operation(summary = "Get equipment by category", description = "Retrieve equipment by category")
    public ResponseEntity<List<EquipmentDto>> getEquipmentByCategory(@PathVariable EquipmentCategory category) {
        log.info("Admin: Fetching equipment by category: {}", category);
        List<EquipmentDto> equipment = equipmentService.getEquipmentByCategory(category);
        return ResponseEntity.ok(equipment);
    }

    @GetMapping("/equipment/status/{status}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    @Operation(summary = "Get equipment by status", description = "Retrieve equipment by status")
    public ResponseEntity<List<EquipmentDto>> getEquipmentByStatus(@PathVariable EquipmentStatus status) {
        log.info("Admin: Fetching equipment by status: {}", status);
        List<EquipmentDto> equipment = equipmentService.getEquipmentByStatus(status);
        return ResponseEntity.ok(equipment);
    }

    @GetMapping("/equipment/maintenance")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    @Operation(summary = "Get equipment requiring maintenance", description = "Retrieve equipment that needs maintenance")
    public ResponseEntity<List<EquipmentDto>> getEquipmentRequiringMaintenance() {
        log.info("Admin: Fetching equipment requiring maintenance");
        List<EquipmentDto> equipment = equipmentService.getEquipmentRequiringMaintenance();
        return ResponseEntity.ok(equipment);
    }

    // Membership Plans Management
    @GetMapping("/membership-plans")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    @Operation(summary = "Get all membership plans", description = "Retrieve all membership plans")
    public ResponseEntity<List<MembershipPlanDto>> getAllMembershipPlans() {
        log.info("Admin: Fetching all membership plans");
        List<MembershipPlanDto> plans = membershipPlanService.getAllMembershipPlans();
        return ResponseEntity.ok(plans);
    }

    @PostMapping("/membership-plans")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create membership plan", description = "Create a new membership plan")
    public ResponseEntity<MembershipPlanDto> createMembershipPlan(@RequestBody MembershipPlanDto planDto) {
        log.info("Admin: Creating new membership plan: {}", planDto.getName());
        MembershipPlanDto created = membershipPlanService.createMembershipPlan(planDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/membership-plans/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update membership plan", description = "Update an existing membership plan")
    public ResponseEntity<MembershipPlanDto> updateMembershipPlan(@PathVariable Long id, @RequestBody MembershipPlanDto planDto) {
        log.info("Admin: Updating membership plan with ID: {}", id);
        MembershipPlanDto updated = membershipPlanService.updateMembershipPlan(id, planDto);
        return ResponseEntity.ok(updated);
    }

    // Analytics
    @GetMapping("/analytics/revenue")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get revenue analytics", description = "Retrieve revenue analytics for specified date range")
    public ResponseEntity<RevenueAnalyticsDto> getRevenueAnalytics(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        log.info("Admin: Fetching revenue analytics from {} to {}", startDate, endDate);
        RevenueAnalyticsDto analytics = analyticsService.getRevenueAnalytics(startDate, endDate);
        return ResponseEntity.ok(analytics);
    }

    @GetMapping("/analytics/utilization")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get utilization analytics", description = "Retrieve facility utilization analytics")
    public ResponseEntity<UtilizationAnalyticsDto> getUtilizationAnalytics(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        log.info("Admin: Fetching utilization analytics from {} to {}", startDate, endDate);
        UtilizationAnalyticsDto analytics = analyticsService.getUtilizationAnalytics(startDate, endDate);
        return ResponseEntity.ok(analytics);
    }
}