package com.company.hr.controller;

import com.company.hr.common.PermissionCheck;
import com.company.hr.common.dto.ApiResponse;
import com.company.hr.common.dto.PagedResponse;
import com.company.hr.dto.recommendation.CreateRecommendationDto;
import com.company.hr.dto.recommendation.RecommendationResponse;
import com.company.hr.entity.User;
import com.company.hr.security.CustomUserDetails;
import com.company.hr.service.RecommendationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/recommendations")
@RequiredArgsConstructor
@Tag(name = "推荐池")
public class RecommendationController {

    private final RecommendationService recommendationService;

    @GetMapping
    @PermissionCheck("recommendation:write")
    @Operation(summary = "查询推荐池列表")
    public ApiResponse<PagedResponse<RecommendationResponse>> listRecommendations(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int pageSize) {
        Page<RecommendationResponse> result = recommendationService.listRecommendations(page, pageSize);
        return ApiResponse.ok(PagedResponse.<RecommendationResponse>builder()
                .data(result.getContent())
                .total(result.getTotalElements())
                .page(result.getNumber() + 1)
                .pageSize(result.getSize())
                .totalPages(result.getTotalPages())
                .build());
    }

    @GetMapping("/{id}")
    @PermissionCheck("recommendation:write")
    @Operation(summary = "获取推荐详情")
    public ApiResponse<RecommendationResponse> getRecommendation(@PathVariable String id) {
        return ApiResponse.ok(recommendationService.getRecommendation(id));
    }

    @PostMapping
    @PermissionCheck("recommendation:write")
    @Operation(summary = "添加推荐")
    public ApiResponse<RecommendationResponse> createRecommendation(
            @Valid @RequestBody CreateRecommendationDto dto,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        User currentUser = userDetails.getUser();
        return ApiResponse.ok(recommendationService.createRecommendation(dto, currentUser));
    }

    @DeleteMapping("/{id}")
    @PermissionCheck("recommendation:write")
    @Operation(summary = "删除推荐")
    public ApiResponse<Void> deleteRecommendation(
            @PathVariable String id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        User currentUser = userDetails.getUser();
        recommendationService.deleteRecommendation(id, currentUser);
        return ApiResponse.ok();
    }
}
