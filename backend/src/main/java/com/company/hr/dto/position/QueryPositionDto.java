package com.company.hr.dto.position;

import com.company.hr.common.dto.PaginationDto;
import com.company.hr.enums.PositionStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "职位查询条件")
public class QueryPositionDto extends PaginationDto {

    @Schema(description = "关键词（职位名称/部门）")
    private String keyword;

    @Schema(description = "部门")
    private String department;

    @Schema(description = "状态")
    private PositionStatus status;

    @Schema(description = "负责人ID")
    private String ownerId;
}
