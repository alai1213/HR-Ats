package com.company.hr.dto.position;

import com.company.hr.enums.PositionPriority;
import com.company.hr.enums.PositionStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "更新职位")
public class UpdatePositionDto {

    @Schema(description = "职位名称")
    private String title;

    @Schema(description = "部门")
    private String department;

    @Schema(description = "招聘人数")
    private Integer headcount;

    @Schema(description = "职位描述")
    private String description;

    @Schema(description = "岗位要求")
    private String requirements;

    @Schema(description = "优先级")
    private PositionPriority priority;

    @Schema(description = "状态")
    private PositionStatus status;
}
