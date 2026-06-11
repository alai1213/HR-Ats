package com.company.hr.dto.user;

import com.company.hr.common.dto.PaginationDto;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "用户查询条件")
public class QueryUserDto extends PaginationDto {

    @Schema(description = "关键词（姓名/邮箱/部门）")
    private String keyword;
}
