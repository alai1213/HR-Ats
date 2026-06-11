package com.company.hr.controller;

import com.company.hr.common.PermissionCheck;
import com.company.hr.common.dto.ApiResponse;
import com.company.hr.common.dto.PagedResponse;
import com.company.hr.dto.offer.ApproveOfferDto;
import com.company.hr.dto.offer.CreateOfferDto;
import com.company.hr.dto.offer.OfferResponse;
import com.company.hr.entity.User;
import com.company.hr.security.CustomUserDetails;
import com.company.hr.service.OfferService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/offers")
@RequiredArgsConstructor
@Tag(name = "Offer审批")
public class OfferController {

    private final OfferService offerService;

    @GetMapping
    @PermissionCheck({"offer:approve", "candidate:read:all"})
    @Operation(summary = "查询Offer列表")
    public ApiResponse<PagedResponse<OfferResponse>> listOffers(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int pageSize) {
        Page<OfferResponse> result = offerService.listOffers(page, pageSize);
        return ApiResponse.ok(PagedResponse.<OfferResponse>builder()
                .data(result.getContent())
                .total(result.getTotalElements())
                .page(result.getNumber() + 1)
                .pageSize(result.getSize())
                .totalPages(result.getTotalPages())
                .build());
    }

    @GetMapping("/candidate/{candidateId}")
    @PermissionCheck({"offer:approve", "candidate:read:all"})
    @Operation(summary = "查询候选人的Offer")
    public ApiResponse<PagedResponse<OfferResponse>> listOffersByCandidate(
            @PathVariable String candidateId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int pageSize) {
        Page<OfferResponse> result = offerService.listOffersByCandidate(candidateId, page, pageSize);
        return ApiResponse.ok(PagedResponse.<OfferResponse>builder()
                .data(result.getContent())
                .total(result.getTotalElements())
                .page(result.getNumber() + 1)
                .pageSize(result.getSize())
                .totalPages(result.getTotalPages())
                .build());
    }

    @PostMapping
    @PermissionCheck("offer:approve")
    @Operation(summary = "创建Offer")
    public ApiResponse<OfferResponse> createOffer(
            @Valid @RequestBody CreateOfferDto dto,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        User currentUser = userDetails.getUser();
        return ApiResponse.ok(offerService.createOffer(dto, currentUser));
    }

    @GetMapping("/{id}")
    @PermissionCheck({"offer:approve", "candidate:read:all"})
    @Operation(summary = "获取Offer详情")
    public ApiResponse<OfferResponse> getOffer(@PathVariable String id) {
        return ApiResponse.ok(offerService.getOffer(id));
    }

    @PatchMapping("/{id}/approve")
    @PermissionCheck("offer:approve")
    @Operation(summary = "审批Offer")
    public ApiResponse<OfferResponse> approveOffer(
            @PathVariable String id,
            @Valid @RequestBody ApproveOfferDto dto,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        User currentUser = userDetails.getUser();
        return ApiResponse.ok(offerService.approveOffer(id, dto, currentUser));
    }

    @DeleteMapping("/{id}")
    @PermissionCheck("offer:approve")
    @Operation(summary = "删除Offer")
    public ApiResponse<Void> deleteOffer(
            @PathVariable String id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        User currentUser = userDetails.getUser();
        offerService.deleteOffer(id, currentUser);
        return ApiResponse.ok();
    }
}
