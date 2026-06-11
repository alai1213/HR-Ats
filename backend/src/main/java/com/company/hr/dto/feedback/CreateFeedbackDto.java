package com.company.hr.dto.feedback;

import com.company.hr.enums.FeedbackResult;
import com.company.hr.enums.SuggestedLevel;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateFeedbackDto {

    @NotBlank
    private String interviewId;

    @NotBlank
    private String candidateId;

    private Integer technicalScore;

    private Integer communicationScore;

    private Integer projectScore;

    private String overallComment;

    private FeedbackResult result = FeedbackResult.PENDING;

    private SuggestedLevel suggestedLevel;

    private String detailComment;
}
