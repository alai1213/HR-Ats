package com.company.hr.dto.interview;

import com.company.hr.common.dto.PaginationDto;
import com.company.hr.enums.InterviewRound;
import com.company.hr.enums.InterviewStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class QueryInterviewDto extends PaginationDto {

    private String candidateId;
    private String interviewerId;
    private InterviewStatus status;
    private InterviewRound round;
}
