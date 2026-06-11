package com.company.hr.dto.candidate;

import com.company.hr.common.dto.PaginationDto;
import com.company.hr.enums.CandidateSource;
import com.company.hr.enums.CandidateStage;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "候选人查询条件")
public class QueryCandidateDto extends PaginationDto {

    @Schema(description = "关键词（姓名/电话/邮箱/公司）")
    private String keyword;

    @Schema(description = "职位ID")
    private String positionId;

    @Schema(description = "部门")
    private String department;

    @Schema(description = "阶段")
    private CandidateStage stage;

    @Schema(description = "来源")
    private CandidateSource source;

    @Schema(description = "负责人ID")
    private String ownerId;

    @Schema(description = "创建开始时间")
    private String createdFrom;

    @Schema(description = "创建结束时间")
    private String createdTo;
}
