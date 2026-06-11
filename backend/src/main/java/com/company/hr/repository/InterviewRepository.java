package com.company.hr.repository;

import com.company.hr.entity.Interview;
import com.company.hr.enums.InterviewRound;
import com.company.hr.enums.InterviewStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface InterviewRepository extends JpaRepository<Interview, String> {

    Page<Interview> findByCandidate_Id(String candidateId, Pageable pageable);

    Page<Interview> findByInterviewer_Id(String interviewerId, Pageable pageable);

    @Query("SELECT i FROM Interview i " +
           "WHERE (:candidateId IS NULL OR i.candidate.id = :candidateId) " +
           "AND (:interviewerId IS NULL OR i.interviewer.id = :interviewerId) " +
           "AND (:status IS NULL OR i.status = :status) " +
           "AND (:round IS NULL OR i.round = :round)")
    Page<Interview> findByFilters(@Param("candidateId") String candidateId,
                                  @Param("interviewerId") String interviewerId,
                                  @Param("status") InterviewStatus status,
                                  @Param("round") InterviewRound round,
                                  Pageable pageable);
}
