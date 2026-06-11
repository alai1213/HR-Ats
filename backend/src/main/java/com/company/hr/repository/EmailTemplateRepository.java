package com.company.hr.repository;

import com.company.hr.entity.EmailTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmailTemplateRepository extends JpaRepository<EmailTemplate, String> {

    Optional<EmailTemplate> findByCode(String code);
}
