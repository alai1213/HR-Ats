package com.company.hr.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EfficiencyMetrics {

    private double avgDaysPerStage;
    private double offerAcceptanceRate;
    private double interviewPassRate;
}
