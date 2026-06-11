package com.company.hr.controller;

import com.company.hr.common.CurrentUser;
import com.company.hr.common.PermissionCheck;
import com.company.hr.common.dto.ApiResponse;
import com.company.hr.common.dto.PagedResponse;
import com.company.hr.dto.candidate.BatchUpdateCandidateDto;
import com.company.hr.dto.candidate.CandidateDetailResponse;
import com.company.hr.dto.candidate.CandidateResponse;
import com.company.hr.dto.candidate.CreateCandidateDto;
import com.company.hr.dto.candidate.QueryCandidateDto;
import com.company.hr.dto.candidate.UpdateCandidateDto;
import com.company.hr.dto.candidate.UpdateStageDto;
import com.company.hr.security.CustomUserDetails;
import com.company.hr.service.AuditLogService;
import com.company.hr.service.CandidateService;
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
@RequestMapping("/candidates")
@RequiredArgsConstructor
@Tag(name = "候选人管理")
public class CandidateController {

    private final CandidateService candidateService;
    private final AuditLogService auditLogService;

    @GetMapping
    @PermissionCheck({"candidate:read:all", "candidate:read:assigned"})
    @Operation(summary = "查询候选人列表")
    public ApiResponse<PagedResponse<CandidateResponse>> list(@Valid QueryCandidateDto query) {
        return ApiResponse.ok(PagedResponse.from(candidateService.findAll(query)));
    }

    @GetMapping("/{id}")
    @PermissionCheck({"candidate:read:all", "candidate:read:assigned"})
    @Operation(summary = "获取候选人详情")
    public ApiResponse<CandidateDetailResponse> getById(@PathVariable String id) {
        return ApiResponse.ok(candidateService.findById(id));
    }

    @PostMapping
    @PermissionCheck("candidate:write")
    @Operation(summary = "创建候选人")
    public ApiResponse<CandidateResponse> create(@Valid @RequestBody CreateCandidateDto dto,
                                                  @CurrentUser CustomUserDetails currentUser) {
        CandidateResponse response = candidateService.create(dto);
        auditLogService.saveAuditLog(
                currentUser.getUser().getId(),
                "CREATE",
                "candidate",
                response.getId(),
                "Candidate",
                "Created candidate: " + response.getName()
        );
        return ApiResponse.ok(response);
    }

    @PatchMapping("/{id}")
    @PermissionCheck("candidate:write")
    @Operation(summary = "更新候选人")
    public ApiResponse<CandidateResponse> update(@PathVariable String id,
                                                  @Valid @RequestBody UpdateCandidateDto dto,
                                                  @CurrentUser CustomUserDetails currentUser) {
        CandidateResponse response = candidateService.update(id, dto);
        auditLogService.saveAuditLog(
                currentUser.getUser().getId(),
                "UPDATE",
                "candidate",
                id,
                "Candidate",
                "Updated candidate: " + response.getName()
        );
        return ApiResponse.ok(response);
    }

    @PatchMapping("/{id}/stage")
    @PermissionCheck({"candidate:write", "candidate:advance"})
    @Operation(summary = "更新候选人阶段")
    public ApiResponse<CandidateResponse> updateStage(@PathVariable String id,
                                                       @Valid @RequestBody UpdateStageDto dto,
                                                       @CurrentUser CustomUserDetails currentUser) {
        CandidateResponse response = candidateService.updateStage(id, dto.getStage());
        auditLogService.saveAuditLog(
                currentUser.getUser().getId(),
                "UPDATE_STAGE",
                "candidate",
                id,
                "Candidate",
                "Updated candidate stage to: " + dto.getStage()
        );
        return ApiResponse.ok(response);
    }

    @PostMapping("/batch")
    @PermissionCheck("candidate:write")
    @Operation(summary = "批量更新候选人")
    public ApiResponse<Void> batchUpdate(@Valid @RequestBody BatchUpdateCandidateDto dto,
                                         @CurrentUser CustomUserDetails currentUser) {
        candidateService.batchUpdate(dto);
        auditLogService.saveAuditLog(
                currentUser.getUser().getId(),
                "BATCH_UPDATE",
                "candidate",
                null,
                "Candidate",
                "Batch updated " + dto.getIds().size() + " candidates"
        );
        return ApiResponse.ok();
    }

    @DeleteMapping("/{id}")
    @PermissionCheck("candidate:delete")
    @Operation(summary = "删除候选人")
    public ApiResponse<Void> delete(@PathVariable String id,
                                    @CurrentUser CustomUserDetails currentUser) {
        candidateService.delete(id);
        auditLogService.saveAuditLog(
                currentUser.getUser().getId(),
                "DELETE",
                "candidate",
                id,
                "Candidate",
                "Deleted candidate: " + id
        );
        return ApiResponse.ok();
    }
}
