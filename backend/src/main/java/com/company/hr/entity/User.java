package com.company.hr.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @Column(name = "id", updatable = false, nullable = false)
    private String id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(nullable = false)
    private String name;

    @Column
    private String avatar;

    @Column
    private String department;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    @Builder.Default
    private Set<Role> roles = new HashSet<>();

    @OneToMany(mappedBy = "owner")
    @Builder.Default
    private List<Position> ownedPositions = new ArrayList<>();

    @OneToMany(mappedBy = "owner")
    @Builder.Default
    private List<Candidate> ownedCandidates = new ArrayList<>();

    @OneToMany(mappedBy = "interviewer")
    @Builder.Default
    private List<Interview> interviews = new ArrayList<>();

    @OneToMany(mappedBy = "evaluator")
    @Builder.Default
    private List<InterviewFeedback> interviewFeedbacks = new ArrayList<>();

    @OneToMany(mappedBy = "submitter")
    @Builder.Default
    private List<OfferApproval> offerApprovals = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    @Builder.Default
    private List<AuditLog> auditLogs = new ArrayList<>();

    @OneToMany(mappedBy = "addedBy")
    @Builder.Default
    private List<RecommendationPool> recommendationPools = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        if (id == null) {
            id = java.util.UUID.randomUUID().toString();
        }
    }
}
