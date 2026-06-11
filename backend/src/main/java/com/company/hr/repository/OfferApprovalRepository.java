package com.company.hr.repository;

import com.company.hr.entity.OfferApproval;
import com.company.hr.enums.OfferApprovalStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OfferApprovalRepository extends JpaRepository<OfferApproval, String> {

    List<OfferApproval> findByCandidate_Id(String candidateId);

    Page<OfferApproval> findByStatus(OfferApprovalStatus status, Pageable pageable);
}
