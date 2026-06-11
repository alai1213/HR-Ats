package com.company.hr.dto.offer;

import com.company.hr.enums.OfferApprovalStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApproveOfferDto {

    @NotNull
    private OfferApprovalStatus status;

    private String approvalNotes;
}
