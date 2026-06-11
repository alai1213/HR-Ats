package com.company.hr.service;

import com.company.hr.entity.AuditLog;
import com.company.hr.entity.User;
import com.company.hr.repository.AuditLogRepository;
import com.company.hr.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    @SneakyThrows
    public void log(User user, String action, String module, String targetId, String targetType, Object detail) {
        AuditLog log = AuditLog.builder()
                .user(user)
                .action(action)
                .module(module)
                .targetId(targetId)
                .targetType(targetType)
                .detail(detail == null ? null : objectMapper.writeValueAsString(detail))
                .build();
        auditLogRepository.save(log);
    }

    @Transactional
    public void saveAuditLog(String userId, String action, String module, String targetId, String targetType, String detail) {
        User user = null;
        if (userId != null) {
            user = userRepository.findById(userId).orElse(null);
        }

        AuditLog auditLog = AuditLog.builder()
                .user(user)
                .action(action)
                .module(module)
                .targetId(targetId)
                .targetType(targetType)
                .detail(detail)
                .build();

        auditLogRepository.save(auditLog);
    }
}
