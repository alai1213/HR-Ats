package com.company.hr.dto.position;

import com.company.hr.enums.PositionPriority;
import com.company.hr.enums.PositionStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "职位响应")
public class PositionResponse {

    @Schema(description = "职位ID")
    private String id;

    @Schema(description = "职位名称")
    private String title;

    @Schema(description = "部门")
    private String department;

    @Schema(description = "招聘人数")
    private int headcount;

    @Schema(description = "已招聘人数")
    private int hiredCount;

    @Schema(description = "负责人ID")
    private String ownerId;

    @Schema(description = "负责人姓名")
    private String ownerName;

    @Schema(description = "职位描述")
    private String description;

    @Schema(description = "岗位要求")
    private String requirements;

    @Schema(description = "优先级")
    private PositionPriority priority;

    @Schema(description = "状态")
    private PositionStatus status;

    @Schema(description = "创建时间")
    private LocalDateTime createdAt;

    @Schema(description = "更新时间")
    private LocalDateTime updatedAt;
}
