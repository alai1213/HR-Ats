package com.company.hr.repository;

import com.company.hr.entity.Position;
import com.company.hr.enums.PositionStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PositionRepository extends JpaRepository<Position, String> {

    Page<Position> findByTitleContainingOrDepartmentContaining(String title, String department, Pageable pageable);

    List<Position> findByStatus(PositionStatus status);

    Page<Position> findByDepartmentAndStatus(String department, PositionStatus status, Pageable pageable);

    @Query("SELECT p FROM Position p " +
           "WHERE (:keyword IS NULL OR p.title LIKE %:keyword% OR p.department LIKE %:keyword%) " +
           "AND (:status IS NULL OR p.status = :status) " +
           "AND (:ownerId IS NULL OR p.owner.id = :ownerId)")
    Page<Position> findByFilters(@Param("keyword") String keyword,
                                 @Param("status") PositionStatus status,
                                 @Param("ownerId") String ownerId,
                                 Pageable pageable);
}
