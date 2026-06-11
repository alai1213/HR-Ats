package com.company.hr.controller;

import com.company.hr.common.PermissionCheck;
import com.company.hr.common.dto.ApiResponse;
import com.company.hr.dto.dashboard.*;
import com.company.hr.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
@Tag(name = "数据看板")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/overview")
    @PermissionCheck("dashboard:read")
    @Operation(summary = "数据概览")
    public ApiResponse<DashboardOverview> getOverview() {
        return ApiResponse.ok(dashboardService.getOverview());
    }

    @GetMapping("/funnel")
    @PermissionCheck("dashboard:read")
    @Operation(summary = "招聘漏斗")
    public ApiResponse<FunnelResponse> getFunnel() {
        return ApiResponse.ok(dashboardService.getFunnel());
    }

    @GetMapping("/efficiency")
    @PermissionCheck("dashboard:read")
    @Operation(summary = "效率指标")
    public ApiResponse<EfficiencyMetrics> getEfficiency() {
        return ApiResponse.ok(dashboardService.getEfficiency());
    }

    @GetMapping("/channels")
    @PermissionCheck("dashboard:read")
    @Operation(summary = "渠道统计")
    public ApiResponse<List<ChannelStat>> getChannels() {
        return ApiResponse.ok(dashboardService.getChannels());
    }

    @GetMapping("/positions")
    @PermissionCheck("dashboard:read")
    @Operation(summary = "职位完成度")
    public ApiResponse<List<PositionCompletion>> getPositions() {
        return ApiResponse.ok(dashboardService.getPositions());
    }
}
