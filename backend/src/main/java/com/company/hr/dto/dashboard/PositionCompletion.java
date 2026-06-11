package com.company.hr.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PositionCompletion {

    private String positionTitle;
    private int headcount;
    private int hiredCount;
    private double completionRate;
}
