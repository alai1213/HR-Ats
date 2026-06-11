package com.company.hr.dto.recommendation;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecommendationResponse {

    private String id;
    private String candidateId;
    private String candidateName;
    private String addedByName;
    private String highlight;
    private LocalDateTime createdAt;
}
