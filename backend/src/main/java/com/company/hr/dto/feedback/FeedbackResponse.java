package com.company.hr.dto.feedback;

import com.company.hr.enums.FeedbackResult;
import com.company.hr.enums.InterviewRound;
import com.company.hr.enums.SuggestedLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeedbackResponse {

    private String id;
    private String interviewId;
    private String candidateId;
    private String evaluatorId;
    private String evaluatorName;
    private Integer technicalScore;
    private Integer communicationScore;
    private Integer projectScore;
    private String overallComment;
    private FeedbackResult result;
    private SuggestedLevel suggestedLevel;
    private String detailComment;
    private InterviewRound interviewRound;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
