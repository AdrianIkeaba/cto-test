package com.gym.backend.util;

import com.gym.backend.dto.*;
import com.gym.backend.dto.analytics.*;
import com.gym.backend.entity.*;
import com.gym.backend.entity.enums.*;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.stream.Collectors;

/**
 * Utility class for mapping between entities and DTOs
 */
@Component
public class DtoMapper {

    // User mapping methods
    public UserDto mapToUserDto(User user) {
        if (user == null) return null;

        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setDateOfBirth(user.getDateOfBirth());
        dto.setActive(user.isActive());
        dto.setEmailVerified(user.isEmailVerified());
        dto.setLastLoginAt(user.getLastLoginAt());

        if (user.getRoles() != null) {
            dto.setRoles(user.getRoles().stream()
                .map(this::mapToRoleDto)
                .collect(Collectors.toSet()));
        }

        return dto;
    }

    public User mapToUser(UserDto dto) {
        if (dto == null) return null;

        User user = new User();
        user.setId(dto.getId());
        user.setEmail(dto.getEmail());
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setPhoneNumber(dto.getPhoneNumber());
        user.setDateOfBirth(dto.getDateOfBirth());
        user.setActive(dto.isActive());
        user.setEmailVerified(dto.isEmailVerified());
        user.setLastLoginAt(dto.getLastLoginAt());

        return user;
    }

    public RoleDto mapToRoleDto(Role role) {
        if (role == null) return null;

        RoleDto dto = new RoleDto();
        dto.setId(role.getId());
        dto.setName(role.getName());
        dto.setDescription(role.getDescription());
        return dto;
    }

    // Member Profile mapping methods
    public MemberProfileDto mapToMemberProfileDto(MemberProfile memberProfile) {
        if (memberProfile == null) return null;

        MemberProfileDto dto = new MemberProfileDto();
        dto.setId(memberProfile.getId());
        dto.setUserId(memberProfile.getUser().getId());
        dto.setEmergencyContactName(memberProfile.getEmergencyContactName());
        dto.setEmergencyContactPhone(memberProfile.getEmergencyContactPhone());
        dto.setMedicalConditions(memberProfile.getMedicalConditions());
        dto.setFitnessGoals(memberProfile.getFitnessGoals());
        dto.setPreferredTrainingTime(memberProfile.getPreferredTrainingTime());
        dto.setMembershipType(memberProfile.getMembershipType());
        dto.setMembershipStartDate(memberProfile.getMembershipStartDate());
        dto.setMembershipEndDate(memberProfile.getMembershipEndDate());
        dto.setHeightCm(memberProfile.getHeightCm());
        dto.setWeightKg(memberProfile.getWeightKg());
        return dto;
    }

    public MemberProfile mapToMemberProfile(MemberProfileDto dto) {
        if (dto == null) return null;

        MemberProfile memberProfile = new MemberProfile();
        memberProfile.setId(dto.getId());
        memberProfile.setEmergencyContactName(dto.getEmergencyContactName());
        memberProfile.setEmergencyContactPhone(dto.getEmergencyContactPhone());
        memberProfile.setMedicalConditions(dto.getMedicalConditions());
        memberProfile.setFitnessGoals(dto.getFitnessGoals());
        memberProfile.setPreferredTrainingTime(dto.getPreferredTrainingTime());
        memberProfile.setMembershipType(dto.getMembershipType());
        memberProfile.setMembershipStartDate(dto.getMembershipStartDate());
        memberProfile.setMembershipEndDate(dto.getMembershipEndDate());
        memberProfile.setHeightCm(dto.getHeightCm());
        memberProfile.setWeightKg(dto.getWeightKg());
        return memberProfile;
    }

    // Trainer Profile mapping methods
    public TrainerDto mapToTrainerDto(TrainerProfile trainerProfile) {
        if (trainerProfile == null) return null;

        TrainerDto dto = new TrainerDto();
        dto.setId(trainerProfile.getId());
        dto.setUserId(trainerProfile.getUser().getId());
        dto.setEmployeeId(trainerProfile.getEmployeeId());
        dto.setSpecialization(trainerProfile.getSpecialization());
        dto.setYearsOfExperience(trainerProfile.getYearsOfExperience());
        dto.setCertifications(trainerProfile.getCertifications());
        dto.setHourlyRate(trainerProfile.getHourlyRate());
        dto.setBio(trainerProfile.getBio());
        return dto;
    }

    public TrainerProfile mapToTrainerProfile(TrainerDto dto) {
        if (dto == null) return null;

        TrainerProfile trainerProfile = new TrainerProfile();
        trainerProfile.setId(dto.getId());
        trainerProfile.setEmployeeId(dto.getEmployeeId());
        trainerProfile.setSpecialization(dto.getSpecialization());
        trainerProfile.setYearsOfExperience(dto.getYearsOfExperience());
        trainerProfile.setCertifications(dto.getCertifications());
        trainerProfile.setHourlyRate(dto.getHourlyRate());
        trainerProfile.setBio(dto.getBio());
        return trainerProfile;
    }

    // Gym Class mapping methods
    public GymClassDto mapToGymClassDto(GymClass gymClass) {
        if (gymClass == null) return null;

        GymClassDto dto = new GymClassDto();
        dto.setId(gymClass.getId());
        dto.setName(gymClass.getName());
        dto.setDescription(gymClass.getDescription());
        dto.setDurationMinutes(gymClass.getDurationMinutes());
        dto.setMaxCapacity(gymClass.getMaxCapacity());
        dto.setDifficultyLevel(gymClass.getDifficultyLevel());
        dto.setCategory(gymClass.getCategory());
        dto.setActive(gymClass.isActive());
        dto.setPrice(gymClass.getPrice());

        if (gymClass.getTrainer() != null) {
            dto.setTrainerId(gymClass.getTrainer().getId());
            dto.setTrainer(mapToTrainerDto(gymClass.getTrainer()));
        }

        return dto;
    }

    public GymClass mapToGymClass(GymClassDto dto) {
        if (dto == null) return null;

        GymClass gymClass = new GymClass();
        gymClass.setId(dto.getId());
        gymClass.setName(dto.getName());
        gymClass.setDescription(dto.getDescription());
        gymClass.setDurationMinutes(dto.getDurationMinutes());
        gymClass.setMaxCapacity(dto.getMaxCapacity());
        gymClass.setDifficultyLevel(dto.getDifficultyLevel());
        gymClass.setCategory(dto.getCategory());
        gymClass.setActive(dto.isActive());
        gymClass.setPrice(dto.getPrice());
        return gymClass;
    }

    // Class Schedule mapping methods
    public ClassScheduleDto mapToClassScheduleDto(ClassSchedule classSchedule) {
        if (classSchedule == null) return null;

        ClassScheduleDto dto = new ClassScheduleDto();
        dto.setId(classSchedule.getId());
        dto.setStartTime(classSchedule.getStartTime());
        dto.setEndTime(classSchedule.getEndTime());
        dto.setCurrentBookings(classSchedule.getCurrentBookings());
        dto.setRoomName(classSchedule.getRoomName());
        dto.setRecurring(classSchedule.isRecurring());
        dto.setRecurrencePattern(classSchedule.getRecurrencePattern());
        dto.setRecurrenceDayOfWeek(classSchedule.getRecurrenceDayOfWeek());
        dto.setRecurrenceEndDate(classSchedule.getRecurrenceEndDate());
        dto.setActive(classSchedule.isActive());

        if (classSchedule.getGymClass() != null) {
            dto.setGymClassId(classSchedule.getGymClass().getId());
            dto.setGymClass(mapToGymClassDto(classSchedule.getGymClass()));
        }

        return dto;
    }

    public ClassSchedule mapToClassSchedule(ClassScheduleDto dto) {
        if (dto == null) return null;

        ClassSchedule classSchedule = new ClassSchedule();
        classSchedule.setId(dto.getId());
        classSchedule.setStartTime(dto.getStartTime());
        classSchedule.setEndTime(dto.getEndTime());
        classSchedule.setCurrentBookings(dto.getCurrentBookings());
        classSchedule.setRoomName(dto.getRoomName());
        classSchedule.setRecurring(dto.isRecurring());
        classSchedule.setRecurrencePattern(dto.getRecurrencePattern());
        classSchedule.setRecurrenceDayOfWeek(dto.getRecurrenceDayOfWeek());
        classSchedule.setRecurrenceEndDate(dto.getRecurrenceEndDate());
        classSchedule.setActive(dto.isActive());
        return classSchedule;
    }

    // Class Booking mapping methods
    public ClassBookingDto mapToClassBookingDto(ClassBooking classBooking) {
        if (classBooking == null) return null;

        ClassBookingDto dto = new ClassBookingDto();
        dto.setId(classBooking.getId());
        dto.setBookingReference(classBooking.getBookingReference());
        dto.setStatus(classBooking.getStatus());
        dto.setBookingDate(classBooking.getBookingDate());
        dto.setCancellationReason(classBooking.getCancellationReason());
        dto.setCancellationDate(classBooking.getCancellationDate());
        dto.setAttended(classBooking.isAttended());
        dto.setAttendanceTime(classBooking.getAttendanceTime());
        dto.setAmountPaid(classBooking.getAmountPaid());

        if (classBooking.getMember() != null) {
            dto.setMemberId(classBooking.getMember().getId());
            dto.setMember(mapToMemberDto(classBooking.getMember()));
        }

        if (classBooking.getClassSchedule() != null) {
            dto.setClassScheduleId(classBooking.getClassSchedule().getId());
            dto.setClassSchedule(mapToClassScheduleDto(classBooking.getClassSchedule()));
        }

        return dto;
    }

    public ClassBooking mapToClassBooking(ClassBookingDto dto) {
        if (dto == null) return null;

        ClassBooking classBooking = new ClassBooking();
        classBooking.setId(dto.getId());
        classBooking.setBookingReference(dto.getBookingReference());
        classBooking.setStatus(dto.getStatus());
        classBooking.setBookingDate(dto.getBookingDate());
        classBooking.setCancellationReason(dto.getCancellationReason());
        classBooking.setCancellationDate(dto.getCancellationDate());
        classBooking.setAttended(dto.isAttended());
        classBooking.setAttendanceTime(dto.getAttendanceTime());
        classBooking.setAmountPaid(dto.getAmountPaid());
        return classBooking;
    }

    // Equipment mapping methods
    public EquipmentDto mapToEquipmentDto(Equipment equipment) {
        if (equipment == null) return null;

        EquipmentDto dto = new EquipmentDto();
        dto.setId(equipment.getId());
        dto.setName(equipment.getName());
        dto.setDescription(equipment.getDescription());
        dto.setEquipmentCode(equipment.getEquipmentCode());
        dto.setCategory(equipment.getCategory());
        dto.setBrand(equipment.getBrand());
        dto.setModel(equipment.getModel());
        dto.setSerialNumber(equipment.getSerialNumber());
        dto.setPurchaseDate(equipment.getPurchaseDate());
        dto.setPurchasePrice(equipment.getPurchasePrice());
        dto.setWarrantyExpiryDate(equipment.getWarrantyExpiryDate());
        dto.setMaintenanceDate(equipment.getMaintenanceDate());
        dto.setNextMaintenanceDate(equipment.getNextMaintenanceDate());
        dto.setStatus(equipment.getStatus());
        dto.setLocation(equipment.getLocation());
        dto.setActive(equipment.isActive());
        return dto;
    }

    public Equipment mapToEquipment(EquipmentDto dto) {
        if (dto == null) return null;

        Equipment equipment = new Equipment();
        equipment.setId(dto.getId());
        equipment.setName(dto.getName());
        equipment.setDescription(dto.getDescription());
        equipment.setEquipmentCode(dto.getEquipmentCode());
        equipment.setCategory(dto.getCategory());
        equipment.setBrand(dto.getBrand());
        equipment.setModel(dto.getModel());
        equipment.setSerialNumber(dto.getSerialNumber());
        equipment.setPurchaseDate(dto.getPurchaseDate());
        equipment.setPurchasePrice(dto.getPurchasePrice());
        equipment.setWarrantyExpiryDate(dto.getWarrantyExpiryDate());
        equipment.setMaintenanceDate(dto.getMaintenanceDate());
        equipment.setNextMaintenanceDate(dto.getNextMaintenanceDate());
        equipment.setStatus(dto.getStatus());
        equipment.setLocation(dto.getLocation());
        equipment.setActive(dto.isActive());
        return equipment;
    }

    // Membership Plan mapping methods
    public MembershipPlanDto mapToMembershipPlanDto(MembershipPlan membershipPlan) {
        if (membershipPlan == null) return null;

        MembershipPlanDto dto = new MembershipPlanDto();
        dto.setId(membershipPlan.getId());
        dto.setName(membershipPlan.getName());
        dto.setDescription(membershipPlan.getDescription());
        dto.setPrice(membershipPlan.getPrice());
        dto.setBillingCycle(membershipPlan.getBillingCycle());
        dto.setDurationDays(membershipPlan.getDurationDays());
        dto.setIncludesPersonalTraining(membershipPlan.isIncludesPersonalTraining());
        dto.setMaxPtSessionsPerMonth(membershipPlan.getMaxPtSessionsPerMonth());
        dto.setIncludesGroupClasses(membershipPlan.isIncludesGroupClasses());
        dto.setUnlimitedGroupClasses(membershipPlan.isUnlimitedGroupClasses());
        dto.setMaxGroupClassesPerMonth(membershipPlan.getMaxGroupClassesPerMonth());
        dto.setAccessHours(membershipPlan.getAccessHours());
        dto.setPriorityBooking(membershipPlan.isPriorityBooking());
        dto.setFreezeAllowed(membershipPlan.isFreezeAllowed());
        dto.setMaxFreezeDays(membershipPlan.getMaxFreezeDays());
        dto.setActive(membershipPlan.isActive());
        return dto;
    }

    public MembershipPlan mapToMembershipPlan(MembershipPlanDto dto) {
        if (dto == null) return null;

        MembershipPlan membershipPlan = new MembershipPlan();
        membershipPlan.setId(dto.getId());
        membershipPlan.setName(dto.getName());
        membershipPlan.setDescription(dto.getDescription());
        membershipPlan.setPrice(dto.getPrice());
        membershipPlan.setBillingCycle(dto.getBillingCycle());
        membershipPlan.setDurationDays(dto.getDurationDays());
        membershipPlan.setIncludesPersonalTraining(dto.isIncludesPersonalTraining());
        membershipPlan.setMaxPtSessionsPerMonth(dto.getMaxPtSessionsPerMonth());
        membershipPlan.setIncludesGroupClasses(dto.isIncludesGroupClasses());
        membershipPlan.setUnlimitedGroupClasses(dto.isUnlimitedGroupClasses());
        membershipPlan.setMaxGroupClassesPerMonth(dto.getMaxGroupClassesPerMonth());
        membershipPlan.setAccessHours(dto.getAccessHours());
        membershipPlan.setPriorityBooking(dto.isPriorityBooking());
        membershipPlan.setFreezeAllowed(dto.isFreezeAllowed());
        membershipPlan.setMaxFreezeDays(dto.getMaxFreezeDays());
        membershipPlan.setActive(dto.isActive());
        return membershipPlan;
    }

    // Subscription mapping methods
    public SubscriptionDto mapToSubscriptionDto(Subscription subscription) {
        if (subscription == null) return null;

        SubscriptionDto dto = new SubscriptionDto();
        dto.setId(subscription.getId());
        dto.setStartDate(subscription.getStartDate());
        dto.setEndDate(subscription.getEndDate());
        dto.setStatus(subscription.getStatus());
        dto.setAutoRenewal(subscription.isAutoRenewal());
        dto.setBillingDay(subscription.getBillingDay());
        dto.setNextBillingDate(subscription.getNextBillingDate());
        dto.setLastBillingDate(subscription.getLastBillingDate());
        dto.setNotes(subscription.getNotes());
        dto.setFreezeStartDate(subscription.getFreezeStartDate());
        dto.setFreezeEndDate(subscription.getFreezeEndDate());

        if (subscription.getMember() != null) {
            dto.setMemberId(subscription.getMember().getId());
        }

        if (subscription.getMembershipPlan() != null) {
            dto.setMembershipPlanId(subscription.getMembershipPlan().getId());
            dto.setMembershipPlan(mapToMembershipPlanDto(subscription.getMembershipPlan()));
        }

        return dto;
    }

    // Payment mapping methods
    public PaymentDto mapToPaymentDto(Payment payment) {
        if (payment == null) return null;

        PaymentDto dto = new PaymentDto();
        dto.setId(payment.getId());
        dto.setAmount(payment.getAmount());
        dto.setCurrency(payment.getCurrency());
        dto.setPaymentDate(payment.getPaymentDate());
        dto.setPaymentMethod(payment.getPaymentMethod());
        dto.setStatus(payment.getStatus());
        dto.setDueDate(payment.getDueDate());
        dto.setGatewayTransactionId(payment.getGatewayTransactionId());
        dto.setGatewayResponse(payment.getGatewayResponse());
        dto.setFailureReason(payment.getFailureReason());
        dto.setReceiptNumber(payment.getReceiptNumber());
        dto.setNotes(payment.getNotes());

        if (payment.getMember() != null) {
            dto.setMemberId(payment.getMember().getId());
            dto.setMember(mapToMemberDto(payment.getMember()));
        }

        if (payment.getSubscription() != null) {
            dto.setSubscriptionId(payment.getSubscription().getId());
        }

        if (payment.getInvoice() != null) {
            dto.setInvoiceId(payment.getInvoice().getId());
        }

        return dto;
    }

    public Payment mapToPayment(PaymentDto dto) {
        if (dto == null) return null;

        Payment payment = new Payment();
        payment.setId(dto.getId());
        payment.setAmount(dto.getAmount());
        payment.setCurrency(dto.getCurrency());
        payment.setPaymentDate(dto.getPaymentDate());
        payment.setPaymentMethod(dto.getPaymentMethod());
        payment.setStatus(dto.getStatus());
        payment.setDueDate(dto.getDueDate());
        payment.setGatewayTransactionId(dto.getGatewayTransactionId());
        payment.setGatewayResponse(dto.getGatewayResponse());
        payment.setFailureReason(dto.getFailureReason());
        payment.setReceiptNumber(dto.getReceiptNumber());
        payment.setNotes(dto.getNotes());
        return payment;
    }

    // PT Session mapping methods
    public PTSessionDto mapToPTSessionDto(PTSession ptSession) {
        if (ptSession == null) return null;

        PTSessionDto dto = new PTSessionDto();
        dto.setId(ptSession.getId());
        dto.setSessionDate(ptSession.getSessionDate());
        dto.setDurationMinutes(ptSession.getDurationMinutes());
        dto.setStatus(ptSession.getStatus());
        dto.setSessionType(ptSession.getSessionType());
        dto.setGoals(ptSession.getGoals());
        dto.setWorkoutNotes(ptSession.getWorkoutNotes());
        dto.setClientFeedback(ptSession.getClientFeedback());
        dto.setRating(ptSession.getRating());
        dto.setPrice(ptSession.getPrice());
        dto.setCancellationReason(ptSession.getCancellationReason());
        dto.setCancellationTime(ptSession.getCancellationTime());
        dto.setMakeupSession(ptSession.isMakeupSession());
        dto.setRoomLocation(ptSession.getRoomLocation());

        if (ptSession.getMember() != null) {
            dto.setMemberId(ptSession.getMember().getId());
            dto.setMember(mapToMemberDto(ptSession.getMember()));
        }

        if (ptSession.getTrainer() != null) {
            dto.setTrainerId(ptSession.getTrainer().getId());
            dto.setTrainer(mapToTrainerDto(ptSession.getTrainer()));
        }

        return dto;
    }

    // Attendance mapping methods
    public AttendanceDto mapToAttendanceDto(Attendance attendance) {
        if (attendance == null) return null;

        AttendanceDto dto = new AttendanceDto();
        dto.setId(attendance.getId());
        dto.setCheckInTime(attendance.getCheckInTime());
        dto.setCheckOutTime(attendance.getCheckOutTime());
        dto.setVisitType(attendance.getVisitType());
        dto.setPurpose(attendance.getPurpose());
        dto.setNotes(attendance.getNotes());

        if (attendance.getMember() != null) {
            dto.setMemberId(attendance.getMember().getId());
            dto.setMember(mapToMemberDto(attendance.getMember()));
        }

        if (attendance.getClassBooking() != null) {
            dto.setClassBookingId(attendance.getClassBooking().getId());
        }

        if (attendance.getPtSession() != null) {
            dto.setPtSessionId(attendance.getPtSession().getId());
        }

        return dto;
    }

    // Member mapping methods
    public MemberDto mapToMemberDto(MemberProfile memberProfile) {
        if (memberProfile == null) return null;

        MemberDto dto = new MemberDto();
        dto.setId(memberProfile.getId());
        dto.setUserId(memberProfile.getUser().getId());
        dto.setEmergencyContactName(memberProfile.getEmergencyContactName());
        dto.setEmergencyContactPhone(memberProfile.getEmergencyContactPhone());
        dto.setMedicalConditions(memberProfile.getMedicalConditions());
        dto.setFitnessGoals(memberProfile.getFitnessGoals());
        dto.setPreferredWorkoutTimes(memberProfile.getPreferredTrainingTime());
        dto.setMembershipStartDate(memberProfile.getMembershipStartDate());
        dto.setMembershipEndDate(memberProfile.getMembershipEndDate());
        dto.setActive(memberProfile.isActive());

        if (memberProfile.getUser() != null) {
            dto.setUser(mapToUserDto(memberProfile.getUser()));
        }

        return dto;
    }
}
