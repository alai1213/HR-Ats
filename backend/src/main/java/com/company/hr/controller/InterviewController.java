package com.company.hr.controller;

import com.company.hr.common.PermissionCheck;
import com.company.hr.common.dto.ApiResponse;
import com.company.hr.common.dto.PagedResponse;
import com.company.hr.dto.interview.CreateInterviewDto;
import com.company.hr.dto.interview.InterviewResponse;
import com.company.hr.dto.interview.QueryInterviewDto;
import com.company.hr.entity.User;
import com.company.hr.security.CustomUserDetails;
import com.company.hr.service.InterviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/interviews")
@RequiredArgsConstructor
@Tag(name = "面试管理")
public class InterviewController {

    private final InterviewService interviewService;

    @GetMapping
    @PermissionCheck({"interview:read", "candidate:read:all", "candidate:read:assigned"})
    @Operation(summary = "查询面试列表")
    public ApiResponse<PagedResponse<InterviewResponse>> listInterviews(@Valid QueryInterviewDto query) {
        Page<InterviewResponse> page = interviewService.listInterviews(query);
        return ApiResponse.ok(PagedResponse.<InterviewResponse>builder()
                .data(page.getContent())
                .total(page.getTotalElements())
                .page(page.getNumber() + 1)
                .pageSize(page.getSize())
                .totalPages(page.getTotalPages())
                .build());
    }

    @GetMapping("/{id}")
    @PermissionCheck({"interview:read", "candidate:read:all", "candidate:read:assigned"})
    @Operation(summary = "获取面试详情")
    public ApiResponse<InterviewResponse> getInterview(@PathVariable String id) {
        return ApiResponse.ok(interviewService.getInterview(id));
    }

    @PostMapping
    @PermissionCheck("interview:create")
    @Operation(summary = "创建面试")
    public ApiResponse<InterviewResponse> createInterview(
            @Valid @RequestBody CreateInterviewDto dto,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        User currentUser = userDetails.getUser();
        return ApiResponse.ok(interviewService.createInterview(dto, currentUser));
    }

    @PutMapping("/{id}")
    @PermissionCheck("interview:create")
    @Operation(summary = "更新面试")
    public ApiResponse<InterviewResponse> updateInterview(
            @PathVariable String id,
            @Valid @RequestBody CreateInterviewDto dto,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        User currentUser = userDetails.getUser();
        return ApiResponse.ok(interviewService.updateInterview(id, dto, currentUser));
    }

    @DeleteMapping("/{id}")
    @PermissionCheck("interview:create")
    @Operation(summary = "删除面试")
    public ApiResponse<Void> deleteInterview(
            @PathVariable String id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        User currentUser = userDetails.getUser();
        interviewService.deleteInterview(id, currentUser);
        return ApiResponse.ok();
    }
}
