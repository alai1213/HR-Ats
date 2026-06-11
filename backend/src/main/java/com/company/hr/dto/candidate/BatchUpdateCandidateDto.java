package com.company.hr.dto.candidate;

import com.company.hr.enums.CandidateStage;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "批量更新候选人")
public class BatchUpdateCandidateDto {

    @NotEmpty(message = "候选人ID列表不能为空")
    @Schema(description = "候选人ID列表")
    private List<String> ids;

    @Schema(description = "阶段")
    private CandidateStage stage;

    @Schema(description = "负责人ID")
    private String ownerId;
}
