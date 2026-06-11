package com.company.hr.repository;

import com.company.hr.entity.CandidateTag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CandidateTagRepository extends JpaRepository<CandidateTag, String> {

    List<CandidateTag> findByCandidate_Id(String candidateId);

    void deleteByCandidate_Id(String candidateId);
}
