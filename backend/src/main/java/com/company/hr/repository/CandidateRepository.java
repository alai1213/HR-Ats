package com.company.hr.repository;

import com.company.hr.entity.Candidate;
import com.company.hr.enums.CandidateStage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CandidateRepository extends JpaRepository<Candidate, String> {

    List<Candidate> findByStage(CandidateStage stage);

    @Query("SELECT c FROM Candidate c " +
           "WHERE (:keyword IS NULL OR c.name LIKE %:keyword% OR c.phone LIKE %:keyword% " +
           "OR c.email LIKE %:keyword% OR c.currentCompany LIKE %:keyword%) " +
           "AND (:positionId IS NULL OR c.position.id = :positionId) " +
           "AND (:stage IS NULL OR c.stage = :stage) " +
           "AND (:source IS NULL OR c.source = :source) " +
           "AND (:ownerId IS NULL OR c.owner.id = :ownerId) " +
           "AND (:department IS NULL OR c.position.department = :department) " +
           "AND (:createdFrom IS NULL OR c.createdAt >= :createdFrom) " +
           "AND (:createdTo IS NULL OR c.createdAt <= :createdTo)")
    Page<Candidate> findByFilters(@Param("keyword") String keyword,
                                  @Param("positionId") String positionId,
                                  @Param("stage") CandidateStage stage,
                                  @Param("source") com.company.hr.enums.CandidateSource source,
                                  @Param("ownerId") String ownerId,
                                  @Param("department") String department,
                                  @Param("createdFrom") LocalDateTime createdFrom,
                                  @Param("createdTo") LocalDateTime createdTo,
                                  Pageable pageable);

    @Modifying
    @Query("UPDATE Candidate c SET c.stage = :stage WHERE c.id IN :ids")
    int batchUpdateStage(@Param("ids") List<String> ids, @Param("stage") CandidateStage stage);

    @Modifying
    @Query("UPDATE Candidate c SET c.owner.id = :ownerId WHERE c.id IN :ids")
    int batchUpdateOwner(@Param("ids") List<String> ids, @Param("ownerId") String ownerId);
}
