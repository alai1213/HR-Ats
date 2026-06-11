package com.company.hr.service;

import com.company.hr.dto.position.CreatePositionDto;
import com.company.hr.dto.position.PositionResponse;
import com.company.hr.dto.position.QueryPositionDto;
import com.company.hr.dto.position.UpdatePositionDto;
import com.company.hr.entity.Position;
import com.company.hr.entity.User;
import com.company.hr.repository.PositionRepository;
import com.company.hr.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PositionService {

    private final PositionRepository positionRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public Page<PositionResponse> findAll(QueryPositionDto query) {
        Pageable pageable = PageRequest.of(query.getPage() - 1, query.getPageSize());
        Page<Position> positionPage;

        if (query.getKeyword() != null && !query.getKeyword().isBlank()) {
            positionPage = positionRepository.findByTitleContainingOrDepartmentContaining(
                    query.getKeyword(), query.getKeyword(), pageable);
        } else if (query.getDepartment() != null && query.getStatus() != null) {
            positionPage = positionRepository.findByDepartmentAndStatus(
                    query.getDepartment(), query.getStatus(), pageable);
        } else {
            positionPage = positionRepository.findByFilters(
                    query.getKeyword(), query.getStatus(), query.getOwnerId(), pageable);
        }

        return positionPage.map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public PositionResponse findById(String id) {
        Position position = positionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Position not found: " + id));
        return toResponse(position);
    }

    @Transactional
    public PositionResponse create(CreatePositionDto dto, String currentUserId) {
        User owner = userRepository.findById(currentUserId)
                .orElseThrow(() -> new RuntimeException("User not found: " + currentUserId));

        Position position = Position.builder()
                .title(dto.getTitle())
                .department(dto.getDepartment())
                .headcount(dto.getHeadcount())
                .description(dto.getDescription())
                .requirements(dto.getRequirements())
                .priority(dto.getPriority())
                .status(dto.getStatus())
                .owner(owner)
                .build();

        Position saved = positionRepository.save(position);
        return toResponse(saved);
    }

    @Transactional
    public PositionResponse update(String id, UpdatePositionDto dto) {
        Position position = positionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Position not found: " + id));

        if (dto.getTitle() != null) {
            position.setTitle(dto.getTitle());
        }
        if (dto.getDepartment() != null) {
            position.setDepartment(dto.getDepartment());
        }
        if (dto.getHeadcount() != null) {
            position.setHeadcount(dto.getHeadcount());
        }
        if (dto.getDescription() != null) {
            position.setDescription(dto.getDescription());
        }
        if (dto.getRequirements() != null) {
            position.setRequirements(dto.getRequirements());
        }
        if (dto.getPriority() != null) {
            position.setPriority(dto.getPriority());
        }
        if (dto.getStatus() != null) {
            position.setStatus(dto.getStatus());
        }

        Position saved = positionRepository.save(position);
        return toResponse(saved);
    }

    @Transactional
    public void delete(String id) {
        Position position = positionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Position not found: " + id));
        positionRepository.delete(position);
    }

    private PositionResponse toResponse(Position position) {
        return PositionResponse.builder()
                .id(position.getId())
                .title(position.getTitle())
                .department(position.getDepartment())
                .headcount(position.getHeadcount())
                .hiredCount(position.getHiredCount())
                .ownerId(position.getOwner() != null ? position.getOwner().getId() : null)
                .ownerName(position.getOwner() != null ? position.getOwner().getName() : null)
                .description(position.getDescription())
                .requirements(position.getRequirements())
                .priority(position.getPriority())
                .status(position.getStatus())
                .createdAt(position.getCreatedAt())
                .updatedAt(position.getUpdatedAt())
                .build();
    }
}
