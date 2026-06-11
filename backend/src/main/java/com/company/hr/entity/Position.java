package com.company.hr.entity;

import com.company.hr.enums.PositionPriority;
import com.company.hr.enums.PositionStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
    name = "positions",
    indexes = {
        @Index(name = "idx_position_department", columnList = "department"),
        @Index(name = "idx_position_status", columnList = "status"),
        @Index(name = "idx_position_owner_id", columnList = "owner_id")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Position {

    @Id
    @Column(name = "id", updatable = false, nullable = false)
    private String id;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "department", nullable = false)
    private String department;

    @Column(name = "headcount", nullable = false)
    @Builder.Default
    private int headcount = 1;

    @Column(name = "hired_count", nullable = false)
    @Builder.Default
    private int hiredCount = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    private User owner;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "requirements", columnDefinition = "TEXT")
    private String requirements;

    @Enumerated(EnumType.STRING)
    @Column(name = "priority", nullable = false)
    private PositionPriority priority;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private PositionStatus status;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "position")
    @Builder.Default
    private List<Candidate> candidates = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        if (id == null) {
            id = java.util.UUID.randomUUID().toString();
        }
    }
}
