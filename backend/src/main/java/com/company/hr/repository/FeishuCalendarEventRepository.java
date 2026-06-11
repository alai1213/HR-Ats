package com.company.hr.repository;

import com.company.hr.entity.FeishuCalendarEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FeishuCalendarEventRepository extends JpaRepository<FeishuCalendarEvent, String> {
}
