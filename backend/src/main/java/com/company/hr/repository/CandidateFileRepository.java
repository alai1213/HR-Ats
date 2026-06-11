package com.company.hr.repository;

import com.company.hr.entity.CandidateFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CandidateFileRepository extends JpaRepository<CandidateFile, String> {
}
