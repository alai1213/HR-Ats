package com.company.hr.repository;

import com.company.hr.entity.InterviewFeedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InterviewFeedbackRepository extends JpaRepository<InterviewFeedback, String> {

    List<InterviewFeedback> findByCandidate_Id(String candidateId);

    List<InterviewFeedback> findByInterview_Id(String interviewId);

    List<InterviewFeedback> findByEvaluator_Id(String evaluatorId);
}
