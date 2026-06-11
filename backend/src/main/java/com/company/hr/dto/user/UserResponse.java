package com.company.hr.dto.user;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "用户响应")
public class UserResponse {

    @Schema(description = "用户ID")
    private String id;

    @Schema(description = "邮箱")
    private String email;

    @Schema(description = "姓名")
    private String name;

    @Schema(description = "头像")
    private String avatar;

    @Schema(description = "部门")
    private String department;

    @Schema(description = "是否激活")
    private Boolean isActive;

    @Schema(description = "角色列表")
    private List<String> roles;

    @Schema(description = "创建时间")
    private LocalDateTime createdAt;
}
