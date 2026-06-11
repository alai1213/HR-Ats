package com.company.hr.service;

import com.company.hr.dto.interview.CreateInterviewDto;
import com.company.hr.dto.interview.InterviewResponse;
import com.company.hr.dto.interview.QueryInterviewDto;
import com.company.hr.entity.Candidate;
import com.company.hr.entity.Interview;
import com.company.hr.entity.User;
import com.company.hr.repository.CandidateRepository;
import com.company.hr.repository.InterviewRepository;
import com.company.hr.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class InterviewService {

    private final InterviewRepository interviewRepository;
    private final CandidateRepository candidateRepository;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;
    private final EmailService emailService;

    @Transactional(readOnly = true)
    public Page<InterviewResponse> listInterviews(QueryInterviewDto query) {
        Pageable pageable = PageRequest.of(query.getPage() - 1, query.getPageSize(), Sort.by("createdAt").descending());
        Page<Interview> page = interviewRepository.findByFilters(
                query.getCandidateId(),
                query.getInterviewerId(),
                query.getStatus(),
                query.getRound(),
                pageable
        );
        return page.map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public InterviewResponse getInterview(String id) {
        Interview interview = interviewRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Interview not found: " + id));
        return toResponse(interview);
    }

    @Transactional
    public InterviewResponse createInterview(CreateInterviewDto dto, User currentUser) {
        Candidate candidate = candidateRepository.findById(dto.getCandidateId())
                .orElseThrow(() -> new EntityNotFoundException("Candidate not found: " + dto.getCandidateId()));
        User interviewer = userRepository.findById(dto.getInterviewerId())
                .orElseThrow(() -> new EntityNotFoundException("Interviewer not found: " + dto.getInterviewerId()));

        Interview interview = Interview.builder()
                .candidate(candidate)
                .round(dto.getRound())
                .scheduledAt(dto.getScheduledAt())
                .startTime(dto.getStartTime())
                .endTime(dto.getEndTime())
                .interviewer(interviewer)
                .mode(dto.getMode() != null ? dto.getMode() : com.company.hr.enums.InterviewMode.ONLINE)
                .status(dto.getStatus() != null ? dto.getStatus() : com.company.hr.enums.InterviewStatus.SCHEDULED)
                .notes(dto.getNotes())
                .build();

        Interview saved = interviewRepository.save(interview);

        auditLogService.log(currentUser, "CREATE", "INTERVIEW", saved.getId(), "Interview", null);

        if (interviewer.getEmail() != null) {
            emailService.sendTemplateEmail(
                    interviewer.getEmail(),
                    "INTERVIEW_SCHEDULED",
                    Map.of(
                            "interviewerName", interviewer.getName(),
                            "candidateName", candidate.getName(),
                            "round", saved.getRound().name(),
                            "scheduledAt", saved.getScheduledAt().toString()
                    )
            );
        }

        return toResponse(saved);
    }

    @Transactional
    public InterviewResponse updateInterview(String id, CreateInterviewDto dto, User currentUser) {
        Interview interview = interviewRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Interview not found: " + id));

        Candidate candidate = candidateRepository.findById(dto.getCandidateId())
                .orElseThrow(() -> new EntityNotFoundException("Candidate not found: " + dto.getCandidateId()));
        User interviewer = userRepository.findById(dto.getInterviewerId())
                .orElseThrow(() -> new EntityNotFoundException("Interviewer not found: " + dto.getInterviewerId()));

        interview.setCandidate(candidate);
        interview.setRound(dto.getRound());
        interview.setScheduledAt(dto.getScheduledAt());
        interview.setStartTime(dto.getStartTime());
        interview.setEndTime(dto.getEndTime());
        interview.setInterviewer(interviewer);
        interview.setMode(dto.getMode());
        interview.setStatus(dto.getStatus());
        interview.setNotes(dto.getNotes());

        Interview saved = interviewRepository.save(interview);
        auditLogService.log(currentUser, "UPDATE", "INTERVIEW", saved.getId(), "Interview", null);
        return toResponse(saved);
    }

    @Transactional
    public void deleteInterview(String id, User currentUser) {
        Interview interview = interviewRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Interview not found: " + id));
        interviewRepository.delete(interview);
        auditLogService.log(currentUser, "DELETE", "INTERVIEW", id, "Interview", null);
    }

    private InterviewResponse toResponse(Interview interview) {
        return InterviewResponse.builder()
                .id(interview.getId())
                .candidateId(interview.getCandidate() != null ? interview.getCandidate().getId() : null)
                .candidateName(interview.getCandidate() != null ? interview.getCandidate().getName() : null)
                .round(interview.getRound())
                .scheduledAt(interview.getScheduledAt())
                .startTime(interview.getStartTime())
                .endTime(interview.getEndTime())
                .interviewerId(interview.getInterviewer() != null ? interview.getInterviewer().getId() : null)
                .interviewerName(interview.getInterviewer() != null ? interview.getInterviewer().getName() : null)
                .mode(interview.getMode())
                .status(interview.getStatus())
                .notes(interview.getNotes())
                .createdAt(interview.getCreatedAt())
                .updatedAt(interview.getUpdatedAt())
                .build();
    }
}
