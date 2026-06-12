package com.company.hr.security;

import com.company.hr.common.PermissionCheck;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Aspect
@Component
@RequiredArgsConstructor
public class PermissionCheckAspect {

    @Around("@annotation(permissionCheck)")
    public Object checkPermission(ProceedingJoinPoint joinPoint, PermissionCheck permissionCheck) throws Throwable {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !(authentication.getPrincipal() instanceof CustomUserDetails userDetails)) {
            throw new AccessDeniedException("Authentication required");
        }

        List<String> requiredPermissions = Arrays.asList(permissionCheck.value());
        List<String> userPermissions = userDetails.getPermissions();

        // Super admin bypass: system:manage grants all permissions
        if (userPermissions.contains("system:manage")) {
            return joinPoint.proceed();
        }

        boolean hasPermission = requiredPermissions.stream()
                .anyMatch(userPermissions::contains);

        if (!hasPermission) {
            throw new AccessDeniedException("Access denied. Required one of: " + requiredPermissions);
        }

        return joinPoint.proceed();
    }
}
