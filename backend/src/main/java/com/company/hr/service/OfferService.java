package com.company.hr.service;

import com.company.hr.dto.offer.ApproveOfferDto;
import com.company.hr.dto.offer.CreateOfferDto;
import com.company.hr.dto.offer.OfferResponse;
import com.company.hr.entity.Candidate;
import com.company.hr.entity.OfferApproval;
import com.company.hr.entity.User;
import com.company.hr.enums.OfferApprovalStatus;
import com.company.hr.repository.CandidateRepository;
import com.company.hr.repository.OfferApprovalRepository;
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
public class OfferService {

    private final OfferApprovalRepository offerApprovalRepository;
    private final CandidateRepository candidateRepository;
    private final AuditLogService auditLogService;
    private final EmailService emailService;

    @Transactional(readOnly = true)
    public Page<OfferResponse> listOffers(int page, int pageSize) {
        Pageable pageable = PageRequest.of(page - 1, pageSize, Sort.by("createdAt").descending());
        return offerApprovalRepository.findAll(pageable).map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public OfferResponse getOffer(String id) {
        OfferApproval offer = offerApprovalRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Offer not found: " + id));
        return toResponse(offer);
    }

    @Transactional(readOnly = true)
    public Page<OfferResponse> listOffersByCandidate(String candidateId, int page, int pageSize) {
        Pageable pageable = PageRequest.of(page - 1, pageSize, Sort.by("createdAt").descending());
        // Since repository returns List, we need to handle paging manually or use a different approach
        // For simplicity, convert list to page
        java.util.List<OfferApproval> list = offerApprovalRepository.findByCandidate_Id(candidateId);
        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageable.getPageSize(), list.size());
        java.util.List<OfferApproval> subList = start > list.size() ? java.util.Collections.emptyList() : list.subList(start, end);
        return new org.springframework.data.domain.PageImpl<>(subList, pageable, list.size()).map(this::toResponse);
    }

    @Transactional
    public OfferResponse createOffer(CreateOfferDto dto, User currentUser) {
        Candidate candidate = candidateRepository.findById(dto.getCandidateId())
                .orElseThrow(() -> new EntityNotFoundException("Candidate not found: " + dto.getCandidateId()));

        OfferApproval offer = OfferApproval.builder()
                .candidate(candidate)
                .submitter(currentUser)
                .status(OfferApprovalStatus.HR_SUBMITTED)
                .salary(dto.getSalary())
                .startDate(dto.getStartDate())
                .notes(dto.getNotes())
                .build();

        OfferApproval saved = offerApprovalRepository.save(offer);
        auditLogService.log(currentUser, "CREATE", "OFFER", saved.getId(), "OfferApproval", null);
        return toResponse(saved);
    }

    @Transactional
    public OfferResponse approveOffer(String id, ApproveOfferDto dto, User currentUser) {
        OfferApproval offer = offerApprovalRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Offer not found: " + id));

        offer.setStatus(dto.getStatus());
        offer.setApprovalNotes(dto.getApprovalNotes());

        OfferApproval saved = offerApprovalRepository.save(offer);

        if (saved.getStatus() == OfferApprovalStatus.OFFER_SENT) {
            Candidate candidate = saved.getCandidate();
            if (candidate != null && candidate.getEmail() != null) {
                emailService.sendTemplateEmail(
                        candidate.getEmail(),
                        "OFFER_SENT",
                        Map.of(
                                "candidateName", candidate.getName(),
                                "position", candidate.getPosition() != null ? candidate.getPosition().getTitle() : "",
                                "salary", saved.getSalary() != null ? saved.getSalary() : ""
                        )
                );
            }
        }

        auditLogService.log(currentUser, "APPROVE", "OFFER", saved.getId(), "OfferApproval", null);
        return toResponse(saved);
    }

    @Transactional
    public void deleteOffer(String id, User currentUser) {
        OfferApproval offer = offerApprovalRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Offer not found: " + id));
        offerApprovalRepository.delete(offer);
        auditLogService.log(currentUser, "DELETE", "OFFER", id, "OfferApproval", null);
    }

    private OfferResponse toResponse(OfferApproval offer) {
        return OfferResponse.builder()
                .id(offer.getId())
                .candidateId(offer.getCandidate() != null ? offer.getCandidate().getId() : null)
                .candidateName(offer.getCandidate() != null ? offer.getCandidate().getName() : null)
                .submitterId(offer.getSubmitter() != null ? offer.getSubmitter().getId() : null)
                .submitterName(offer.getSubmitter() != null ? offer.getSubmitter().getName() : null)
                .status(offer.getStatus())
                .salary(offer.getSalary())
                .startDate(offer.getStartDate())
                .notes(offer.getNotes())
                .approvalNotes(offer.getApprovalNotes())
                .createdAt(offer.getCreatedAt())
                .updatedAt(offer.getUpdatedAt())
                .build();
    }
}
