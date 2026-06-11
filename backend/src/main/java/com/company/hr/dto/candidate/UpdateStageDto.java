package com.company.hr.dto.candidate;

import com.company.hr.enums.CandidateStage;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "更新候选人阶段")
public class UpdateStageDto {

    @NotNull(message = "阶段不能为空")
    @Schema(description = "阶段")
    private CandidateStage stage;
}
