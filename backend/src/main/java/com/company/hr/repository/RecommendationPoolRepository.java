package com.company.hr.repository;

import com.company.hr.entity.RecommendationPool;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RecommendationPoolRepository extends JpaRepository<RecommendationPool, String> {

    Optional<RecommendationPool> findByCandidate_Id(String candidateId);

    Page<RecommendationPool> findByAddedBy_Id(String addedById, Pageable pageable);
}
