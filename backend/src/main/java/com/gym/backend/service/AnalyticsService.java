package com.gym.backend.service;

import com.gym.backend.dto.analytics.RevenueAnalyticsDto;
import com.gym.backend.dto.analytics.UtilizationAnalyticsDto;
import com.gym.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Service for generating analytics and reporting data
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final PaymentRepository paymentRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final ClassBookingRepository classBookingRepository;
    private final AttendanceRepository attendanceRepository;
    private final ClassScheduleRepository classScheduleRepository;
    private final InvoiceRepository invoiceRepository;

    /**
     * Get revenue analytics for a specified date range
     */
    public RevenueAnalyticsDto getRevenueAnalytics(LocalDateTime startDate, LocalDateTime endDate) {
        log.info("Generating revenue analytics from {} to {}", startDate, endDate);

        RevenueAnalyticsDto analytics = new RevenueAnalyticsDto();
        
        // Calculate total revenue
        Double totalRevenue = paymentRepository.calculateTotalRevenueInDateRange(startDate, endDate);
        analytics.setTotalRevenue(totalRevenue != null ? totalRevenue : 0.0);
        
        // Calculate monthly revenue (simplified)
        LocalDateTime firstDayOfMonth = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0);
        Double monthlyRevenue = paymentRepository.calculateTotalRevenueInDateRange(firstDayOfMonth, endDate);
        analytics.setMonthlyRevenue(monthlyRevenue != null ? monthlyRevenue : 0.0);
        
        // Calculate average revenue per day
        long daysInRange = startDate.until(endDate, java.time.temporal.ChronoUnit.DAYS);
        analytics.setAverageRevenuePerDay(daysInRange > 0 ? analytics.getTotalRevenue() / daysInRange : 0.0);
        
        // Set growth rate (simplified calculation)
        analytics.setGrowthRate(15.5); // This would need historical data calculation
        
        // Revenue by membership plan (placeholder data)
        Map<String, Double> revenueByMembershipPlan = new HashMap<>();
        revenueByMembershipPlan.put("Basic", 15000.0);
        revenueByMembershipPlan.put("Premium", 25000.0);
        revenueByMembershipPlan.put("VIP", 12000.0);
        analytics.setRevenueByMembershipPlan(revenueByMembershipPlan);
        
        // Revenue by payment method (placeholder data)
        Map<String, Double> revenueByPaymentMethod = new HashMap<>();
        revenueByPaymentMethod.put("Credit Card", 32000.0);
        revenueByPaymentMethod.put("Bank Transfer", 15000.0);
        revenueByPaymentMethod.put("Cash", 5000.0);
        analytics.setRevenueByPaymentMethod(revenueByPaymentMethod);
        
        // Monthly revenue trend (placeholder data)
        Map<String, Double> monthlyRevenueTrend = new HashMap<>();
        monthlyRevenueTrend.put("Jan", 18000.0);
        monthlyRevenueTrend.put("Feb", 19500.0);
        monthlyRevenueTrend.put("Mar", 21000.0);
        monthlyRevenueTrend.put("Apr", 22500.0);
        monthlyRevenueTrend.put("May", 24000.0);
        monthlyRevenueTrend.put("Jun", 25000.0);
        analytics.setMonthlyRevenueTrend(monthlyRevenueTrend);
        
        analytics.setReportGeneratedAt(LocalDateTime.now());
        
        return analytics;
    }

    /**
     * Get utilization analytics for a specified date range
     */
    public UtilizationAnalyticsDto getUtilizationAnalytics(LocalDateTime startDate, LocalDateTime endDate) {
        log.info("Generating utilization analytics from {} to {}", startDate, endDate);

        UtilizationAnalyticsDto analytics = new UtilizationAnalyticsDto();
        
        // Calculate average class occupancy rate
        // This would require complex queries with joins - simplified for demo
        analytics.setAverageClassOccupancyRate(75.5);
        
        // Occupancy by class type (placeholder data)
        Map<String, Double> occupancyByClassType = new HashMap<>();
        occupancyByClassType.put("Cardio", 82.5);
        occupancyByClassType.put("Strength", 68.0);
        occupancyByClassType.put("Yoga", 90.0);
        occupancyByClassType.put("HIIT", 85.5);
        occupancyByClassType.put("Pilates", 73.0);
        analytics.setOccupancyByClassType(occupancyByClassType);
        
        // Utilization by time slot (placeholder data)
        Map<String, Double> utilizationByTimeSlot = new HashMap<>();
        utilizationByTimeSlot.put("6AM-9AM", 65.0);
        utilizationByTimeSlot.put("9AM-12PM", 45.0);
        utilizationByTimeSlot.put("12PM-3PM", 35.0);
        utilizationByTimeSlot.put("3PM-6PM", 85.0);
        utilizationByTimeSlot.put("6PM-9PM", 95.0);
        utilizationByTimeSlot.put("9PM-12AM", 25.0);
        analytics.setUtilizationByTimeSlot(utilizationByTimeSlot);
        
        analytics.setPeakHoursUtilization(95.0);
        
        // Equipment usage (placeholder data)
        Map<String, Integer> equipmentUsage = new HashMap<>();
        equipmentUsage.put("Treadmills", 450);
        equipmentUsage.put("Stationary Bikes", 320);
        equipmentUsage.put("Elliptical Machines", 280);
        equipmentUsage.put("Weight Machines", 380);
        equipmentUsage.put("Free Weights", 520);
        analytics.setEquipmentUsage(equipmentUsage);
        
        analytics.setOverallFacilityUtilization(70.5);
        analytics.setReportGeneratedAt(LocalDateTime.now());
        
        return analytics;
    }
}