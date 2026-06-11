package com.company.hr.dto.offer;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateOfferDto {

    @NotBlank
    private String candidateId;

    private String salary;

    private LocalDate startDate;

    private String notes;
}
