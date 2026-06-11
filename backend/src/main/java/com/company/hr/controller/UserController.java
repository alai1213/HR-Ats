package com.company.hr.controller;

import com.company.hr.common.CurrentUser;
import com.company.hr.common.PermissionCheck;
import com.company.hr.common.dto.ApiResponse;
import com.company.hr.common.dto.PagedResponse;
import com.company.hr.dto.user.QueryUserDto;
import com.company.hr.dto.user.UserResponse;
import com.company.hr.security.CustomUserDetails;
import com.company.hr.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Tag(name = "用户管理")
public class UserController {

    private final UserService userService;

    @GetMapping
    @PermissionCheck("user:read")
    @Operation(summary = "查询用户列表")
    public ApiResponse<PagedResponse<UserResponse>> list(@Valid QueryUserDto query) {
        return ApiResponse.ok(PagedResponse.from(userService.findAll(query)));
    }

    @GetMapping("/{id}")
    @PermissionCheck("user:read")
    @Operation(summary = "获取用户详情")
    public ApiResponse<UserResponse> getById(@PathVariable String id) {
        return ApiResponse.ok(userService.findById(id));
    }
}
