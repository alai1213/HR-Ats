package com.company.hr.service;

import com.company.hr.dto.feedback.CreateFeedbackDto;
import com.company.hr.dto.feedback.FeedbackResponse;
import com.company.hr.entity.Candidate;
import com.company.hr.entity.Interview;
import com.company.hr.entity.InterviewFeedback;
import com.company.hr.entity.User;
import com.company.hr.enums.CandidateStage;
import com.company.hr.enums.FeedbackResult;
import com.company.hr.repository.CandidateRepository;
import com.company.hr.repository.InterviewFeedbackRepository;
import com.company.hr.repository.InterviewRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FeedbackService {

    private final InterviewFeedbackRepository feedbackRepository;
    private final InterviewRepository interviewRepository;
    private final CandidateRepository candidateRepository;
    private final AuditLogService auditLogService;

    @Transactional(readOnly = true)
    public List<FeedbackResponse> listFeedbacks() {
        return feedbackRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public FeedbackResponse getFeedback(String id) {
        InterviewFeedback feedback = feedbackRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Feedback not found: " + id));
        return toResponse(feedback);
    }

    @Transactional
    public FeedbackResponse createFeedback(CreateFeedbackDto dto, User currentUser) {
        Interview interview = interviewRepository.findById(dto.getInterviewId())
                .orElseThrow(() -> new EntityNotFoundException("Interview not found: " + dto.getInterviewId()));
        Candidate candidate = candidateRepository.findById(dto.getCandidateId())
                .orElseThrow(() -> new EntityNotFoundException("Candidate not found: " + dto.getCandidateId()));

        InterviewFeedback feedback = InterviewFeedback.builder()
                .interview(interview)
                .candidate(candidate)
                .evaluator(currentUser)
                .technicalScore(dto.getTechnicalScore())
                .communicationScore(dto.getCommunicationScore())
                .projectScore(dto.getProjectScore())
                .overallComment(dto.getOverallComment())
                .result(dto.getResult() != null ? dto.getResult() : FeedbackResult.PENDING)
                .suggestedLevel(dto.getSuggestedLevel())
                .detailComment(dto.getDetailComment())
                .build();

        InterviewFeedback saved = feedbackRepository.save(feedback);

        if (saved.getResult() == FeedbackResult.PASS) {
            advanceCandidateStage(candidate);
        }

        auditLogService.log(currentUser, "CREATE", "FEEDBACK", saved.getId(), "InterviewFeedback", null);
        return toResponse(saved);
    }

    @Transactional
    public FeedbackResponse updateFeedback(String id, CreateFeedbackDto dto, User currentUser) {
        InterviewFeedback feedback = feedbackRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Feedback not found: " + id));

        Interview interview = interviewRepository.findById(dto.getInterviewId())
                .orElseThrow(() -> new EntityNotFoundException("Interview not found: " + dto.getInterviewId()));
        Candidate candidate = candidateRepository.findById(dto.getCandidateId())
                .orElseThrow(() -> new EntityNotFoundException("Candidate not found: " + dto.getCandidateId()));

        feedback.setInterview(interview);
        feedback.setCandidate(candidate);
        feedback.setTechnicalScore(dto.getTechnicalScore());
        feedback.setCommunicationScore(dto.getCommunicationScore());
        feedback.setProjectScore(dto.getProjectScore());
        feedback.setOverallComment(dto.getOverallComment());
        feedback.setResult(dto.getResult());
        feedback.setSuggestedLevel(dto.getSuggestedLevel());
        feedback.setDetailComment(dto.getDetailComment());

        InterviewFeedback saved = feedbackRepository.save(feedback);

        if (saved.getResult() == FeedbackResult.PASS) {
            advanceCandidateStage(candidate);
        }

        auditLogService.log(currentUser, "UPDATE", "FEEDBACK", saved.getId(), "InterviewFeedback", null);
        return toResponse(saved);
    }

    @Transactional
    public void deleteFeedback(String id, User currentUser) {
        InterviewFeedback feedback = feedbackRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Feedback not found: " + id));
        feedbackRepository.delete(feedback);
        auditLogService.log(currentUser, "DELETE", "FEEDBACK", id, "InterviewFeedback", null);
    }

    private void advanceCandidateStage(Candidate candidate) {
        CandidateStage current = candidate.getStage();
        CandidateStage next = switch (current) {
            case HR_INTERVIEW -> CandidateStage.BUSINESS_INTERVIEW;
            case BUSINESS_INTERVIEW -> CandidateStage.FINAL_INTERVIEW;
            case FINAL_INTERVIEW -> CandidateStage.OFFER_APPROVAL;
            default -> current;
        };
        if (next != current) {
            candidate.setStage(next);
            candidateRepository.save(candidate);
        }
    }

    private FeedbackResponse toResponse(InterviewFeedback feedback) {
        return FeedbackResponse.builder()
                .id(feedback.getId())
                .interviewId(feedback.getInterview() != null ? feedback.getInterview().getId() : null)
                .candidateId(feedback.getCandidate() != null ? feedback.getCandidate().getId() : null)
                .evaluatorId(feedback.getEvaluator() != null ? feedback.getEvaluator().getId() : null)
                .evaluatorName(feedback.getEvaluator() != null ? feedback.getEvaluator().getName() : null)
                .technicalScore(feedback.getTechnicalScore())
                .communicationScore(feedback.getCommunicationScore())
                .projectScore(feedback.getProjectScore())
                .overallComment(feedback.getOverallComment())
                .result(feedback.getResult())
                .suggestedLevel(feedback.getSuggestedLevel())
                .detailComment(feedback.getDetailComment())
                .interviewRound(feedback.getInterview() != null ? feedback.getInterview().getRound() : null)
                .createdAt(feedback.getCreatedAt())
                .updatedAt(feedback.getUpdatedAt())
                .build();
    }
}
