package com.company.hr.service;

import com.company.hr.dto.recommendation.CreateRecommendationDto;
import com.company.hr.dto.recommendation.RecommendationResponse;
import com.company.hr.entity.Candidate;
import com.company.hr.entity.RecommendationPool;
import com.company.hr.entity.User;
import com.company.hr.repository.CandidateRepository;
import com.company.hr.repository.RecommendationPoolRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final RecommendationPoolRepository recommendationPoolRepository;
    private final CandidateRepository candidateRepository;
    private final AuditLogService auditLogService;

    @Transactional(readOnly = true)
    public Page<RecommendationResponse> listRecommendations(int page, int pageSize) {
        Pageable pageable = PageRequest.of(page - 1, pageSize, Sort.by("createdAt").descending());
        return recommendationPoolRepository.findAll(pageable).map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public RecommendationResponse getRecommendation(String id) {
        RecommendationPool pool = recommendationPoolRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Recommendation not found: " + id));
        return toResponse(pool);
    }

    @Transactional
    public RecommendationResponse createRecommendation(CreateRecommendationDto dto, User currentUser) {
        recommendationPoolRepository.findByCandidate_Id(dto.getCandidateId()).ifPresent(existing -> {
            throw new IllegalArgumentException("Candidate already in recommendation pool");
        });

        Candidate candidate = candidateRepository.findById(dto.getCandidateId())
                .orElseThrow(() -> new EntityNotFoundException("Candidate not found: " + dto.getCandidateId()));

        RecommendationPool pool = RecommendationPool.builder()
                .candidate(candidate)
                .addedBy(currentUser)
                .highlight(dto.getHighlight())
                .build();

        RecommendationPool saved = recommendationPoolRepository.save(pool);
        auditLogService.log(currentUser, "CREATE", "RECOMMENDATION", saved.getId(), "RecommendationPool", null);
        return toResponse(saved);
    }

    @Transactional
    public void deleteRecommendation(String id, User currentUser) {
        RecommendationPool pool = recommendationPoolRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Recommendation not found: " + id));
        recommendationPoolRepository.delete(pool);
        auditLogService.log(currentUser, "DELETE", "RECOMMENDATION", id, "RecommendationPool", null);
    }

    private RecommendationResponse toResponse(RecommendationPool pool) {
        return RecommendationResponse.builder()
                .id(pool.getId())
                .candidateId(pool.getCandidate() != null ? pool.getCandidate().getId() : null)
                .candidateName(pool.getCandidate() != null ? pool.getCandidate().getName() : null)
                .addedByName(pool.getAddedBy() != null ? pool.getAddedBy().getName() : null)
                .highlight(pool.getHighlight())
                .createdAt(pool.getCreatedAt())
                .build();
    }
}
