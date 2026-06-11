package com.company.hr.dto.interview;

import com.company.hr.enums.InterviewMode;
import com.company.hr.enums.InterviewRound;
import com.company.hr.enums.InterviewStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterviewResponse {

    private String id;
    private String candidateId;
    private String candidateName;
    private InterviewRound round;
    private LocalDateTime scheduledAt;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String interviewerId;
    private String interviewerName;
    private InterviewMode mode;
    private InterviewStatus status;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
