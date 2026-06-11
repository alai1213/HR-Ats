package com.company.hr.controller;

import com.company.hr.common.PermissionCheck;
import com.company.hr.common.dto.ApiResponse;
import com.company.hr.common.dto.PagedResponse;
import com.company.hr.entity.AuditLog;
import com.company.hr.entity.EmailTemplate;
import com.company.hr.entity.Permission;
import com.company.hr.entity.Role;
import com.company.hr.service.SystemService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/system")
@RequiredArgsConstructor
@Tag(name = "系统管理")
public class SystemController {

    private final SystemService systemService;

    @GetMapping("/roles")
    @PermissionCheck("system:manage")
    @Operation(summary = "获取所有角色")
    public ApiResponse<List<Role>> getRoles() {
        return ApiResponse.ok(systemService.getRoles());
    }

    @GetMapping("/permissions")
    @PermissionCheck("system:manage")
    @Operation(summary = "获取所有权限")
    public ApiResponse<List<Permission>> getPermissions() {
        return ApiResponse.ok(systemService.getPermissions());
    }

    @GetMapping("/audit-logs")
    @PermissionCheck("system:manage")
    @Operation(summary = "查询审计日志")
    public ApiResponse<PagedResponse<AuditLog>> getAuditLogs(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int pageSize,
            @RequestParam(required = false) String module) {
        return ApiResponse.ok(systemService.getAuditLogs(page, pageSize, module));
    }

    @GetMapping("/email-templates")
    @PermissionCheck("system:manage")
    @Operation(summary = "获取邮件模板")
    public ApiResponse<List<EmailTemplate>> getEmailTemplates() {
        return ApiResponse.ok(systemService.getEmailTemplates());
    }

    @PatchMapping("/email-templates/{id}")
    @PermissionCheck("system:manage")
    @Operation(summary = "更新邮件模板")
    public ApiResponse<EmailTemplate> updateEmailTemplate(
            @PathVariable String id,
            @RequestBody Map<String, Object> updates) {
        String subject = updates.containsKey("subject") ? (String) updates.get("subject") : null;
        String body = updates.containsKey("body") ? (String) updates.get("body") : null;
        Boolean isActive = updates.containsKey("isActive") ? (Boolean) updates.get("isActive") : null;
        return ApiResponse.ok(systemService.updateEmailTemplate(id, subject, body, isActive));
    }
}
