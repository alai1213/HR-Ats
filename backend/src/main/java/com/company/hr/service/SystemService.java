package com.company.hr.service;

import com.company.hr.common.dto.PagedResponse;
import com.company.hr.entity.AuditLog;
import com.company.hr.entity.EmailTemplate;
import com.company.hr.entity.Permission;
import com.company.hr.entity.Role;
import com.company.hr.repository.AuditLogRepository;
import com.company.hr.repository.EmailTemplateRepository;
import com.company.hr.repository.PermissionRepository;
import com.company.hr.repository.RoleRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SystemService {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final AuditLogRepository auditLogRepository;
    private final EmailTemplateRepository emailTemplateRepository;

    @Transactional(readOnly = true)
    public List<Role> getRoles() {
        return roleRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Permission> getPermissions() {
        return permissionRepository.findAll();
    }

    @Transactional(readOnly = true)
    public PagedResponse<AuditLog> getAuditLogs(int page, int pageSize, String module) {
        Pageable pageable = PageRequest.of(page - 1, pageSize, Sort.by("createdAt").descending());
        Page<AuditLog> result;
        if (module != null && !module.isBlank()) {
            result = auditLogRepository.findByModule(module, pageable);
        } else {
            result = auditLogRepository.findAll(pageable);
        }
        return PagedResponse.from(result);
    }

    @Transactional(readOnly = true)
    public List<EmailTemplate> getEmailTemplates() {
        return emailTemplateRepository.findAll();
    }

    @Transactional
    public EmailTemplate updateEmailTemplate(String id, String subject, String body, Boolean isActive) {
        EmailTemplate template = emailTemplateRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Email template not found: " + id));
        if (subject != null) {
            template.setSubject(subject);
        }
        if (body != null) {
            template.setBody(body);
        }
        if (isActive != null) {
            template.setActive(isActive);
        }
        return emailTemplateRepository.save(template);
    }
}
