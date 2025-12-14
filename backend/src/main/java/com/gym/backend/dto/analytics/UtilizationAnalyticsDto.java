package com.gym.backend.dto.analytics;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * DTO for utilization analytics
 */
@Data
public class UtilizationAnalyticsDto {

    private Double averageClassOccupancyRate;
    private Map<String, Double> occupancyByClassType;
    private Map<String, Double> utilizationByTimeSlot;
    private Double peakHoursUtilization;
    private Map<String, Integer> equipmentUsage;
    private Double overallFacilityUtilization;
    private LocalDateTime reportGeneratedAt;
}