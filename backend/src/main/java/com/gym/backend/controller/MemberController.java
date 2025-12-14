package com.gym.backend.controller;

import com.gym.backend.dto.*;
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

import java.time.LocalDateTime;
import java.util.List;

/**
 * Member controller for gym member operations
 */
@Slf4j
@RestController
@RequestMapping("/api/member")
@RequiredArgsConstructor
@Tag(name = "Member", description = "Member operations")
@SecurityRequirement(name = "bearer-jwt")
@PreAuthorize("hasRole('MEMBER')")
public class MemberController {

    private final MemberProfileService memberProfileService;
    private final ClassBookingService classBookingService;
    private final SubscriptionService subscriptionService;
    private final PTSessionService ptSessionService;
    private final AttendanceService attendanceService;
    private final PaymentService paymentService;

    // Member Profile Management
    @GetMapping("/profile")
    @Operation(summary = "Get member profile", description = "Get current member's profile information")
    public ResponseEntity<MemberDto> getMemberProfile(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        log.info("Member {} accessing profile", userPrincipal.getId());
        MemberDto memberProfile = memberProfileService.getMemberProfileByUserId(userPrincipal.getId());
        return ResponseEntity.ok(memberProfile);
    }

    @PutMapping("/profile")
    @Operation(summary = "Update member profile", description = "Update current member's profile information")
    public ResponseEntity<MemberDto> updateMemberProfile(@AuthenticationPrincipal UserPrincipal userPrincipal, 
                                                        @RequestBody MemberDto memberDto) {
        log.info("Member {} updating profile", userPrincipal.getId());
        MemberProfileDto memberProfile = memberProfileService.getMemberProfileByUserId(userPrincipal.getId());
        MemberDto updated = memberProfileService.updateMemberProfile(memberProfile.getId(), memberDto);
        return ResponseEntity.ok(updated);
    }

    // Class Bookings
    @GetMapping("/classes/available")
    @Operation(summary = "Get available classes", description = "Get list of available classes to book")
    public ResponseEntity<List<ClassScheduleDto>> getAvailableClasses() {
        log.info("Member accessing available classes");
        List<ClassScheduleDto> availableClasses = classBookingService.getAvailableClasses();
        return ResponseEntity.ok(availableClasses);
    }

    @GetMapping("/bookings")
    @Operation(summary = "Get member bookings", description = "Get current member's class bookings")
    public ResponseEntity<List<ClassBookingDto>> getMemberBookings(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        log.info("Member {} accessing bookings", userPrincipal.getId());
        MemberProfileDto memberProfile = memberProfileService.getMemberProfileByUserId(userPrincipal.getId());
        List<ClassBookingDto> bookings = classBookingService.getBookingsByMember(memberProfile.getId());
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/bookings/upcoming")
    @Operation(summary = "Get upcoming bookings", description = "Get current member's upcoming bookings")
    public ResponseEntity<List<ClassBookingDto>> getUpcomingBookings(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        log.info("Member {} accessing upcoming bookings", userPrincipal.getId());
        MemberProfileDto memberProfile = memberProfileService.getMemberProfileByUserId(userPrincipal.getId());
        List<ClassBookingDto> bookings = classBookingService.getUpcomingBookingsForMember(memberProfile.getId());
        return ResponseEntity.ok(bookings);
    }

    @PostMapping("/bookings")
    @Operation(summary = "Book a class", description = "Book a class for the current member")
    public ResponseEntity<ClassBookingDto> bookClass(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                                    @RequestParam Long scheduleId) {
        log.info("Member {} booking class schedule {}", userPrincipal.getId(), scheduleId);
        MemberProfileDto memberProfile = memberProfileService.getMemberProfileByUserId(userPrincipal.getId());
        ClassBookingDto booking = classBookingService.bookClass(memberProfile.getId(), scheduleId);
        return ResponseEntity.status(HttpStatus.CREATED).body(booking);
    }

    @PutMapping("/bookings/{bookingId}/cancel")
    @Operation(summary = "Cancel booking", description = "Cancel a class booking")
    public ResponseEntity<ClassBookingDto> cancelBooking(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                                        @PathVariable Long bookingId,
                                                        @RequestParam String reason) {
        log.info("Member {} cancelling booking {}", userPrincipal.getId(), bookingId);
        ClassBookingDto booking = classBookingService.cancelBooking(bookingId, reason);
        return ResponseEntity.ok(booking);
    }

    // Personal Training Sessions
    @GetMapping("/pt-sessions")
    @Operation(summary = "Get member PT sessions", description = "Get current member's personal training sessions")
    public ResponseEntity<List<PTSessionDto>> getMemberPTSessions(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        log.info("Member {} accessing PT sessions", userPrincipal.getId());
        MemberProfileDto memberProfile = memberProfileService.getMemberProfileByUserId(userPrincipal.getId());
        List<PTSessionDto> sessions = ptSessionService.getSessionsByMember(memberProfile.getId());
        return ResponseEntity.ok(sessions);
    }

    @GetMapping("/pt-sessions/upcoming")
    @Operation(summary = "Get upcoming PT sessions", description = "Get current member's upcoming personal training sessions")
    public ResponseEntity<List<PTSessionDto>> getUpcomingPTSessions(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        log.info("Member {} accessing upcoming PT sessions", userPrincipal.getId());
        MemberProfileDto memberProfile = memberProfileService.getMemberProfileByUserId(userPrincipal.getId());
        List<PTSessionDto> sessions = ptSessionService.getUpcomingSessionsForMember(memberProfile.getId());
        return ResponseEntity.ok(sessions);
    }

    @PostMapping("/pt-sessions")
    @Operation(summary = "Book PT session", description = "Book a personal training session")
    public ResponseEntity<PTSessionDto> bookPTSession(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                                     @RequestParam Long trainerId,
                                                     @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime sessionDate,
                                                     @RequestParam Integer duration) {
        log.info("Member {} booking PT session with trainer {} for {}", userPrincipal.getId(), trainerId, sessionDate);
        MemberProfileDto memberProfile = memberProfileService.getMemberProfileByUserId(userPrincipal.getId());
        PTSessionDto session = ptSessionService.bookSession(memberProfile.getId(), trainerId, sessionDate, duration);
        return ResponseEntity.status(HttpStatus.CREATED).body(session);
    }

    // Subscriptions
    @GetMapping("/subscriptions")
    @Operation(summary = "Get member subscriptions", description = "Get current member's subscriptions")
    public ResponseEntity<List<SubscriptionDto>> getMemberSubscriptions(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        log.info("Member {} accessing subscriptions", userPrincipal.getId());
        MemberProfileDto memberProfile = memberProfileService.getMemberProfileByUserId(userPrincipal.getId());
        List<SubscriptionDto> subscriptions = subscriptionService.getSubscriptionsByMember(memberProfile.getId());
        return ResponseEntity.ok(subscriptions);
    }

    @GetMapping("/subscriptions/active")
    @Operation(summary = "Get active subscription", description = "Get current member's active subscription")
    public ResponseEntity<SubscriptionDto> getActiveSubscription(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        log.info("Member {} accessing active subscription", userPrincipal.getId());
        MemberProfileDto memberProfile = memberProfileService.getMemberProfileByUserId(userPrincipal.getId());
        SubscriptionDto activeSubscription = subscriptionService.getActiveSubscriptionForMember(memberProfile.getId());
        return ResponseEntity.ok(activeSubscription);
    }

    @PostMapping("/subscriptions")
    @Operation(summary = "Create subscription", description = "Create a new subscription for the member")
    public ResponseEntity<SubscriptionDto> createSubscription(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                                             @RequestBody SubscriptionDto subscriptionDto) {
        log.info("Member {} creating new subscription", userPrincipal.getId());
        MemberProfileDto memberProfile = memberProfileService.getMemberProfileByUserId(userPrincipal.getId());
        subscriptionDto.setMemberId(memberProfile.getId());
        SubscriptionDto created = subscriptionService.createSubscription(subscriptionDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // Attendance
    @GetMapping("/attendance")
    @Operation(summary = "Get member attendance", description = "Get current member's attendance records")
    public ResponseEntity<List<AttendanceDto>> getMemberAttendance(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        log.info("Member {} accessing attendance records", userPrincipal.getId());
        MemberProfileDto memberProfile = memberProfileService.getMemberProfileByUserId(userPrincipal.getId());
        List<AttendanceDto> attendance = attendanceService.getAttendanceByMember(memberProfile.getId());
        return ResponseEntity.ok(attendance);
    }

    @PostMapping("/attendance/check-in")
    @Operation(summary = "Check in", description = "Check in to the gym")
    public ResponseEntity<AttendanceDto> checkIn(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        log.info("Member {} checking in", userPrincipal.getId());
        MemberProfileDto memberProfile = memberProfileService.getMemberProfileByUserId(userPrincipal.getId());
        AttendanceDto attendance = attendanceService.checkIn(memberProfile.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(attendance);
    }

    @PutMapping("/attendance/{attendanceId}/check-out")
    @Operation(summary = "Check out", description = "Check out from the gym")
    public ResponseEntity<AttendanceDto> checkOut(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                                 @PathVariable Long attendanceId) {
        log.info("Member {} checking out", userPrincipal.getId());
        AttendanceDto attendance = attendanceService.checkOut(attendanceId);
        return ResponseEntity.ok(attendance);
    }

    // Payments
    @GetMapping("/payments")
    @Operation(summary = "Get member payments", description = "Get current member's payment history")
    public ResponseEntity<List<PaymentDto>> getMemberPayments(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        log.info("Member {} accessing payment history", userPrincipal.getId());
        MemberProfileDto memberProfile = memberProfileService.getMemberProfileByUserId(userPrincipal.getId());
        List<PaymentDto> payments = paymentService.getPaymentsByMember(memberProfile.getId());
        return ResponseEntity.ok(payments);
    }

    @PostMapping("/payments")
    @Operation(summary = "Process payment", description = "Process a payment for the member")
    public ResponseEntity<PaymentDto> processPayment(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                                    @RequestBody PaymentDto paymentDto) {
        log.info("Member {} processing payment", userPrincipal.getId());
        MemberProfileDto memberProfile = memberProfileService.getMemberProfileByUserId(userPrincipal.getId());
        paymentDto.setMemberId(memberProfile.getId());
        PaymentDto payment = paymentService.processPayment(paymentDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(payment);
    }
}