package com.company.hr.controller;

import com.company.hr.common.PermissionCheck;
import com.company.hr.common.dto.ApiResponse;
import com.company.hr.entity.Candidate;
import com.company.hr.entity.CandidateFile;
import com.company.hr.entity.User;
import com.company.hr.repository.CandidateFileRepository;
import com.company.hr.repository.CandidateRepository;
import com.company.hr.security.CustomUserDetails;
import com.company.hr.service.AuditLogService;
import com.company.hr.service.FileStorageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/files")
@RequiredArgsConstructor
@Tag(name = "文件管理")
public class FileController {

    private final FileStorageService fileStorageService;
    private final CandidateFileRepository candidateFileRepository;
    private final CandidateRepository candidateRepository;
    private final AuditLogService auditLogService;

    @PostMapping("/resume/{candidateId}")
    @PermissionCheck("candidate:write")
    @Operation(summary = "上传简历")
    public ApiResponse<String> uploadResume(
            @PathVariable String candidateId,
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        User currentUser = userDetails.getUser();

        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Candidate not found: " + candidateId));

        String fileUrl = fileStorageService.storeFile(file, candidateId);

        CandidateFile candidateFile = CandidateFile.builder()
                .candidate(candidate)
                .fileName(file.getOriginalFilename())
                .fileUrl(fileUrl)
                .fileType(file.getContentType())
                .fileSize((int) file.getSize())
                .isResume(true)
                .build();

        candidateFileRepository.save(candidateFile);

        auditLogService.log(currentUser, "UPLOAD_RESUME", "FILE", candidateFile.getId(), "CandidateFile", null);

        return ApiResponse.ok(fileUrl);
    }
}
