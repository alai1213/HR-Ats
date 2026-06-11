package com.company.hr.dto.offer;

import com.company.hr.enums.OfferApprovalStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OfferResponse {

    private String id;
    private String candidateId;
    private String candidateName;
    private String submitterId;
    private String submitterName;
    private OfferApprovalStatus status;
    private String salary;
    private LocalDate startDate;
    private String notes;
    private String approvalNotes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
