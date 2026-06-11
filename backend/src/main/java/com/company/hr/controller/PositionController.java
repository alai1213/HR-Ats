package com.company.hr.controller;

import com.company.hr.common.CurrentUser;
import com.company.hr.common.PermissionCheck;
import com.company.hr.common.dto.ApiResponse;
import com.company.hr.common.dto.PagedResponse;
import com.company.hr.dto.position.CreatePositionDto;
import com.company.hr.dto.position.PositionResponse;
import com.company.hr.dto.position.QueryPositionDto;
import com.company.hr.dto.position.UpdatePositionDto;
import com.company.hr.security.CustomUserDetails;
import com.company.hr.service.AuditLogService;
import com.company.hr.service.PositionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/positions")
@RequiredArgsConstructor
@Tag(name = "职位管理")
public class PositionController {

    private final PositionService positionService;
    private final AuditLogService auditLogService;

    @GetMapping
    @PermissionCheck("position:read")
    @Operation(summary = "查询职位列表")
    public ApiResponse<PagedResponse<PositionResponse>> list(@Valid QueryPositionDto query) {
        return ApiResponse.ok(PagedResponse.from(positionService.findAll(query)));
    }

    @GetMapping("/{id}")
    @PermissionCheck("position:read")
    @Operation(summary = "获取职位详情")
    public ApiResponse<PositionResponse> getById(@PathVariable String id) {
        return ApiResponse.ok(positionService.findById(id));
    }

    @PostMapping
    @PermissionCheck("position:create")
    @Operation(summary = "创建职位")
    public ApiResponse<PositionResponse> create(@Valid @RequestBody CreatePositionDto dto,
                                                 @CurrentUser CustomUserDetails currentUser) {
        PositionResponse response = positionService.create(dto, currentUser.getUser().getId());
        auditLogService.saveAuditLog(
                currentUser.getUser().getId(),
                "CREATE",
                "position",
                response.getId(),
                "Position",
                "Created position: " + response.getTitle()
        );
        return ApiResponse.ok(response);
    }

    @PatchMapping("/{id}")
    @PermissionCheck("position:write")
    @Operation(summary = "更新职位")
    public ApiResponse<PositionResponse> update(@PathVariable String id,
                                                 @Valid @RequestBody UpdatePositionDto dto,
                                                 @CurrentUser CustomUserDetails currentUser) {
        PositionResponse response = positionService.update(id, dto);
        auditLogService.saveAuditLog(
                currentUser.getUser().getId(),
                "UPDATE",
                "position",
                id,
                "Position",
                "Updated position: " + response.getTitle()
        );
        return ApiResponse.ok(response);
    }

    @DeleteMapping("/{id}")
    @PermissionCheck("position:write")
    @Operation(summary = "删除职位")
    public ApiResponse<Void> delete(@PathVariable String id,
                                    @CurrentUser CustomUserDetails currentUser) {
        positionService.delete(id);
        auditLogService.saveAuditLog(
                currentUser.getUser().getId(),
                "DELETE",
                "position",
                id,
                "Position",
                "Deleted position: " + id
        );
        return ApiResponse.ok();
    }
}
