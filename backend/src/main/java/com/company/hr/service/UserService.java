package com.company.hr.service;

import com.company.hr.dto.user.QueryUserDto;
import com.company.hr.dto.user.UserResponse;
import com.company.hr.entity.User;
import com.company.hr.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public Page<UserResponse> findAll(QueryUserDto query) {
        Pageable pageable = PageRequest.of(query.getPage() - 1, query.getPageSize());
        Page<User> userPage;

        if (query.getKeyword() != null && !query.getKeyword().isBlank()) {
            String keyword = query.getKeyword();
            userPage = userRepository.findByNameContainingOrEmailContainingOrDepartmentContaining(
                    keyword, keyword, keyword, pageable);
        } else {
            userPage = userRepository.findAll(pageable);
        }

        return userPage.map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public UserResponse findById(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found: " + id));
        return toResponse(user);
    }

    private UserResponse toResponse(User user) {
        List<String> roles = user.getRoles().stream()
                .map(role -> role.getCode())
                .collect(Collectors.toList());

        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .avatar(user.getAvatar())
                .department(user.getDepartment())
                .isActive(user.isActive())
                .roles(roles)
                .createdAt(user.getCreatedAt())
                .build();
    }
}
