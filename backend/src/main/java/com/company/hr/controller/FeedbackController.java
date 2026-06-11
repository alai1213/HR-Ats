package com.company.hr.controller;

import com.company.hr.common.PermissionCheck;
import com.company.hr.common.dto.ApiResponse;
import com.company.hr.dto.feedback.CreateFeedbackDto;
import com.company.hr.dto.feedback.FeedbackResponse;
import com.company.hr.entity.User;
import com.company.hr.security.CustomUserDetails;
import com.company.hr.service.FeedbackService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/feedbacks")
@RequiredArgsConstructor
@Tag(name = "面评管理")
public class FeedbackController {

    private final FeedbackService feedbackService;

    @GetMapping
    @PermissionCheck({"feedback:read:all", "feedback:read:own"})
    @Operation(summary = "查询面评列表")
    public ApiResponse<List<FeedbackResponse>> listFeedbacks() {
        return ApiResponse.ok(feedbackService.listFeedbacks());
    }

    @GetMapping("/{id}")
    @PermissionCheck({"feedback:read:all", "feedback:read:own"})
    @Operation(summary = "获取面评详情")
    public ApiResponse<FeedbackResponse> getFeedback(@PathVariable String id) {
        return ApiResponse.ok(feedbackService.getFeedback(id));
    }

    @PostMapping
    @PermissionCheck("feedback:write")
    @Operation(summary = "创建面评")
    public ApiResponse<FeedbackResponse> createFeedback(
            @Valid @RequestBody CreateFeedbackDto dto,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        User currentUser = userDetails.getUser();
        return ApiResponse.ok(feedbackService.createFeedback(dto, currentUser));
    }

    @PutMapping("/{id}")
    @PermissionCheck("feedback:write")
    @Operation(summary = "更新面评")
    public ApiResponse<FeedbackResponse> updateFeedback(
            @PathVariable String id,
            @Valid @RequestBody CreateFeedbackDto dto,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        User currentUser = userDetails.getUser();
        return ApiResponse.ok(feedbackService.updateFeedback(id, dto, currentUser));
    }

    @DeleteMapping("/{id}")
    @PermissionCheck("feedback:write")
    @Operation(summary = "删除面评")
    public ApiResponse<Void> deleteFeedback(
            @PathVariable String id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        User currentUser = userDetails.getUser();
        feedbackService.deleteFeedback(id, currentUser);
        return ApiResponse.ok();
    }
}
