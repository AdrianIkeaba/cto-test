package com.gym.backend.dto.analytics;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * DTO for revenue analytics
 */
@Data
public class RevenueAnalyticsDto {

    private Double totalRevenue;
    private Double monthlyRevenue;
    private Double averageRevenuePerDay;
    private Double growthRate;
    private Map<String, Double> revenueByMembershipPlan;
    private Map<String, Double> revenueByPaymentMethod;
    private Map<String, Double> monthlyRevenueTrend;
    private LocalDateTime reportGeneratedAt;
}