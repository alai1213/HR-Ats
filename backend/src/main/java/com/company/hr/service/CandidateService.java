package com.company.hr.service;

import com.company.hr.dto.candidate.BatchUpdateCandidateDto;
import com.company.hr.dto.candidate.CandidateDetailResponse;
import com.company.hr.dto.candidate.CandidateResponse;
import com.company.hr.dto.candidate.CreateCandidateDto;
import com.company.hr.dto.candidate.QueryCandidateDto;
import com.company.hr.dto.candidate.UpdateCandidateDto;
import com.company.hr.entity.Candidate;
import com.company.hr.entity.CandidateTag;
import com.company.hr.entity.EmailTemplate;
import com.company.hr.entity.Position;
import com.company.hr.entity.User;
import com.company.hr.enums.CandidateStage;
import com.company.hr.repository.CandidateRepository;
import com.company.hr.repository.CandidateTagRepository;
import com.company.hr.repository.EmailTemplateRepository;
import com.company.hr.repository.PositionRepository;
import com.company.hr.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CandidateService {

    private final CandidateRepository candidateRepository;
    private final CandidateTagRepository candidateTagRepository;
    private final PositionRepository positionRepository;
    private final UserRepository userRepository;
    private final EmailTemplateRepository emailTemplateRepository;
    private final EmailService emailService;

    @Transactional(readOnly = true)
    public Page<CandidateResponse> findAll(QueryCandidateDto query) {
        Pageable pageable = PageRequest.of(query.getPage() - 1, query.getPageSize());

        LocalDateTime createdFrom = parseDateTime(query.getCreatedFrom());
        LocalDateTime createdTo = parseDateTime(query.getCreatedTo());

        Page<Candidate> candidatePage = candidateRepository.findByFilters(
                query.getKeyword(),
                query.getPositionId(),
                query.getStage(),
                query.getSource(),
                query.getOwnerId(),
                query.getDepartment(),
                createdFrom,
                createdTo,
                pageable
        );

        return candidatePage.map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public CandidateDetailResponse findById(String id) {
        Candidate candidate = candidateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Candidate not found: " + id));
        return toDetailResponse(candidate);
    }

    @Transactional
    public CandidateResponse create(CreateCandidateDto dto) {
        Candidate candidate = Candidate.builder()
                .name(dto.getName())
                .phone(dto.getPhone())
                .email(dto.getEmail())
                .wechat(dto.getWechat())
                .gender(dto.getGender())
                .age(dto.getAge())
                .city(dto.getCity())
                .currentCompany(dto.getCurrentCompany())
                .currentPosition(dto.getCurrentPosition())
                .workYears(dto.getWorkYears())
                .education(dto.getEducation())
                .school(dto.getSchool())
                .expectedSalary(dto.getExpectedSalary())
                .source(dto.getSource())
                .stage(dto.getStage())
                .portfolioUrl(dto.getPortfolioUrl())
                .hrNotes(dto.getHrNotes())
                .skills(dto.getSkills())
                .build();

        if (dto.getPositionId() != null) {
            Position position = positionRepository.findById(dto.getPositionId())
                    .orElseThrow(() -> new RuntimeException("Position not found: " + dto.getPositionId()));
            candidate.setPosition(position);
        }

        if (dto.getOwnerId() != null) {
            User owner = userRepository.findById(dto.getOwnerId())
                    .orElseThrow(() -> new RuntimeException("User not found: " + dto.getOwnerId()));
            candidate.setOwner(owner);
        }

        Candidate saved = candidateRepository.save(candidate);

        if (dto.getTags() != null && !dto.getTags().isEmpty()) {
            saveTags(saved, dto.getTags());
        }

        return toResponse(saved);
    }

    @Transactional
    public CandidateResponse update(String id, UpdateCandidateDto dto) {
        Candidate candidate = candidateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Candidate not found: " + id));

        if (dto.getName() != null) {
            candidate.setName(dto.getName());
        }
        if (dto.getPhone() != null) {
            candidate.setPhone(dto.getPhone());
        }
        if (dto.getEmail() != null) {
            candidate.setEmail(dto.getEmail());
        }
        if (dto.getWechat() != null) {
            candidate.setWechat(dto.getWechat());
        }
        if (dto.getGender() != null) {
            candidate.setGender(dto.getGender());
        }
        if (dto.getAge() != null) {
            candidate.setAge(dto.getAge());
        }
        if (dto.getCity() != null) {
            candidate.setCity(dto.getCity());
        }
        if (dto.getCurrentCompany() != null) {
            candidate.setCurrentCompany(dto.getCurrentCompany());
        }
        if (dto.getCurrentPosition() != null) {
            candidate.setCurrentPosition(dto.getCurrentPosition());
        }
        if (dto.getWorkYears() != null) {
            candidate.setWorkYears(dto.getWorkYears());
        }
        if (dto.getEducation() != null) {
            candidate.setEducation(dto.getEducation());
        }
        if (dto.getSchool() != null) {
            candidate.setSchool(dto.getSchool());
        }
        if (dto.getExpectedSalary() != null) {
            candidate.setExpectedSalary(dto.getExpectedSalary());
        }
        if (dto.getSource() != null) {
            candidate.setSource(dto.getSource());
        }
        if (dto.getStage() != null) {
            candidate.setStage(dto.getStage());
        }
        if (dto.getPortfolioUrl() != null) {
            candidate.setPortfolioUrl(dto.getPortfolioUrl());
        }
        if (dto.getHrNotes() != null) {
            candidate.setHrNotes(dto.getHrNotes());
        }
        if (dto.getSkills() != null) {
            candidate.setSkills(dto.getSkills());
        }

        if (dto.getPositionId() != null) {
            Position position = positionRepository.findById(dto.getPositionId())
                    .orElseThrow(() -> new RuntimeException("Position not found: " + dto.getPositionId()));
            candidate.setPosition(position);
        }

        if (dto.getOwnerId() != null) {
            User owner = userRepository.findById(dto.getOwnerId())
                    .orElseThrow(() -> new RuntimeException("User not found: " + dto.getOwnerId()));
            candidate.setOwner(owner);
        }

        Candidate saved = candidateRepository.save(candidate);

        if (dto.getTags() != null) {
            candidateTagRepository.deleteByCandidate_Id(saved.getId());
            if (!dto.getTags().isEmpty()) {
                saveTags(saved, dto.getTags());
            }
        }

        return toResponse(saved);
    }

    @Transactional
    public CandidateResponse updateStage(String id, CandidateStage stage) {
        Candidate candidate = candidateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Candidate not found: " + id));

        CandidateStage oldStage = candidate.getStage();
        candidate.setStage(stage);
        Candidate saved = candidateRepository.save(candidate);

        if (saved.getEmail() != null && !saved.getEmail().isBlank()) {
            emailTemplateRepository.findByCode("STATUS_CHANGED").ifPresent(template -> {
                Map<String, String> variables = new HashMap<>();
                variables.put("name", saved.getName());
                variables.put("oldStage", oldStage.name());
                variables.put("newStage", stage.name());
                emailService.sendByTemplate(template.getCode(), saved.getEmail(), variables);
            });
        }

        return toResponse(saved);
    }

    @Transactional
    public void batchUpdate(BatchUpdateCandidateDto dto) {
        if (dto.getStage() != null) {
            candidateRepository.batchUpdateStage(dto.getIds(), dto.getStage());
        }
        if (dto.getOwnerId() != null) {
            candidateRepository.batchUpdateOwner(dto.getIds(), dto.getOwnerId());
        }
    }

    @Transactional
    public void delete(String id) {
        Candidate candidate = candidateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Candidate not found: " + id));
        candidateRepository.delete(candidate);
    }

    private void saveTags(Candidate candidate, List<String> tags) {
        for (String tagName : tags) {
            CandidateTag tag = CandidateTag.builder()
                    .candidate(candidate)
                    .tag(tagName)
                    .build();
            candidateTagRepository.save(tag);
        }
    }

    private CandidateResponse toResponse(Candidate candidate) {
        List<String> tags = candidate.getTags().stream()
                .map(CandidateTag::getTag)
                .collect(Collectors.toList());

        return CandidateResponse.builder()
                .id(candidate.getId())
                .name(candidate.getName())
                .phone(candidate.getPhone())
                .email(candidate.getEmail())
                .wechat(candidate.getWechat())
                .gender(candidate.getGender())
                .age(candidate.getAge())
                .city(candidate.getCity())
                .avatar(candidate.getAvatar())
                .currentCompany(candidate.getCurrentCompany())
                .currentPosition(candidate.getCurrentPosition())
                .workYears(candidate.getWorkYears())
                .education(candidate.getEducation())
                .school(candidate.getSchool())
                .expectedSalary(candidate.getExpectedSalary())
                .positionId(candidate.getPosition() != null ? candidate.getPosition().getId() : null)
                .positionTitle(candidate.getPosition() != null ? candidate.getPosition().getTitle() : null)
                .source(candidate.getSource())
                .stage(candidate.getStage())
                .ownerId(candidate.getOwner() != null ? candidate.getOwner().getId() : null)
                .ownerName(candidate.getOwner() != null ? candidate.getOwner().getName() : null)
                .portfolioUrl(candidate.getPortfolioUrl())
                .hrNotes(candidate.getHrNotes())
                .skills(candidate.getSkills())
                .resumeParsed(candidate.isResumeParsed())
                .tags(tags)
                .createdAt(candidate.getCreatedAt())
                .updatedAt(candidate.getUpdatedAt())
                .build();
    }

    private CandidateDetailResponse toDetailResponse(Candidate candidate) {
        List<String> tags = candidate.getTags().stream()
                .map(CandidateTag::getTag)
                .collect(Collectors.toList());

        return CandidateDetailResponse.builder()
                .id(candidate.getId())
                .name(candidate.getName())
                .phone(candidate.getPhone())
                .email(candidate.getEmail())
                .wechat(candidate.getWechat())
                .gender(candidate.getGender())
                .age(candidate.getAge())
                .city(candidate.getCity())
                .avatar(candidate.getAvatar())
                .currentCompany(candidate.getCurrentCompany())
                .currentPosition(candidate.getCurrentPosition())
                .workYears(candidate.getWorkYears())
                .education(candidate.getEducation())
                .school(candidate.getSchool())
                .expectedSalary(candidate.getExpectedSalary())
                .source(candidate.getSource())
                .stage(candidate.getStage())
                .portfolioUrl(candidate.getPortfolioUrl())
                .hrNotes(candidate.getHrNotes())
                .skills(candidate.getSkills())
                .workExperience(candidate.getWorkExperience())
                .educationHistory(candidate.getEducationHistory())
                .resumeParsed(candidate.isResumeParsed())
                .position(candidate.getPosition())
                .owner(candidate.getOwner())
                .tags(tags)
                .files(candidate.getFiles())
                .interviews(candidate.getInterviews())
                .feedbacks(candidate.getInterviewFeedbacks())
                .offerApprovals(candidate.getOfferApprovals())
                .recommendationPool(candidate.getRecommendationPool())
                .createdAt(candidate.getCreatedAt())
                .updatedAt(candidate.getUpdatedAt())
                .build();
    }

    private LocalDateTime parseDateTime(String dateStr) {
        if (dateStr == null || dateStr.isBlank()) {
            return null;
        }
        return LocalDateTime.parse(dateStr, DateTimeFormatter.ISO_DATE_TIME);
    }
}
