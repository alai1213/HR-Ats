package com.company.hr.dto.interview;

import com.company.hr.enums.InterviewMode;
import com.company.hr.enums.InterviewRound;
import com.company.hr.enums.InterviewStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateInterviewDto {

    @NotBlank
    private String candidateId;

    @NotNull
    private InterviewRound round;

    @NotNull
    private LocalDateTime scheduledAt;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    @NotBlank
    private String interviewerId;

    private InterviewMode mode = InterviewMode.ONLINE;

    private InterviewStatus status = InterviewStatus.SCHEDULED;

    private String notes;
}
