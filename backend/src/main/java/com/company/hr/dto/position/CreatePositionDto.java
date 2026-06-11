package com.company.hr.dto.position;

import com.company.hr.enums.PositionPriority;
import com.company.hr.enums.PositionStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "创建职位")
public class CreatePositionDto {

    @NotBlank(message = "职位名称不能为空")
    @Schema(description = "职位名称")
    private String title;

    @NotBlank(message = "部门不能为空")
    @Schema(description = "部门")
    private String department;

    @Schema(description = "招聘人数", example = "1")
    @Builder.Default
    private int headcount = 1;

    @Schema(description = "职位描述")
    private String description;

    @Schema(description = "岗位要求")
    private String requirements;

    @Schema(description = "优先级")
    @Builder.Default
    private PositionPriority priority = PositionPriority.MEDIUM;

    @Schema(description = "状态")
    @Builder.Default
    private PositionStatus status = PositionStatus.OPEN;
}
