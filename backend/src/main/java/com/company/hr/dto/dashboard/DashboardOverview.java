package com.company.hr.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardOverview {

    private long totalCandidates;
    private long totalPositions;
    private long totalInterviews;
    private long pendingOffers;
    private long todayInterviews;
}
