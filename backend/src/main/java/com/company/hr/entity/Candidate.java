package com.company.hr.entity;

import com.company.hr.enums.CandidateSource;
import com.company.hr.enums.CandidateStage;
import com.company.hr.enums.Gender;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
    name = "candidates",
    indexes = {
        @Index(name = "idx_candidate_stage", columnList = "stage"),
        @Index(name = "idx_candidate_source", columnList = "source"),
        @Index(name = "idx_candidate_position_id", columnList = "position_id"),
        @Index(name = "idx_candidate_owner_id", columnList = "owner_id"),
        @Index(name = "idx_candidate_created_at", columnList = "created_at")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Candidate {

    @Id
    @Column(name = "id", updatable = false, nullable = false)
    private String id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "phone")
    private String phone;

    @Column(name = "email")
    private String email;

    @Column(name = "wechat")
    private String wechat;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender")
    private Gender gender;

    @Column(name = "age")
    private Integer age;

    @Column(name = "city")
    private String city;

    @Column(name = "avatar")
    private String avatar;

    @Column(name = "current_company")
    private String currentCompany;

    @Column(name = "current_position")
    private String currentPosition;

    @Column(name = "work_years")
    private Double workYears;

    @Column(name = "education")
    private String education;

    @Column(name = "school")
    private String school;

    @Column(name = "expected_salary")
    private String expectedSalary;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "position_id")
    private Position position;

    @Enumerated(EnumType.STRING)
    @Column(name = "source", nullable = false)
    private CandidateSource source;

    @Enumerated(EnumType.STRING)
    @Column(name = "stage", nullable = false)
    private CandidateStage stage;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    private User owner;

    @Column(name = "portfolio_url")
    private String portfolioUrl;

    @Column(name = "hr_notes", columnDefinition = "TEXT")
    private String hrNotes;

    @Column(name = "skills", columnDefinition = "TEXT")
    private String skills;

    @Column(name = "work_experience", columnDefinition = "JSON")
    private String workExperience;

    @Column(name = "education_history", columnDefinition = "JSON")
    private String educationHistory;

    @Column(name = "resume_parsed", nullable = false)
    @Builder.Default
    private boolean resumeParsed = false;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "candidate", cascade = CascadeType.REMOVE)
    @Builder.Default
    private List<CandidateTag> tags = new ArrayList<>();

    @OneToMany(mappedBy = "candidate")
    @Builder.Default
    private List<CandidateFile> files = new ArrayList<>();

    @OneToMany(mappedBy = "candidate")
    @Builder.Default
    private List<Interview> interviews = new ArrayList<>();

    @OneToMany(mappedBy = "candidate")
    @Builder.Default
    private List<InterviewFeedback> interviewFeedbacks = new ArrayList<>();

    @OneToMany(mappedBy = "candidate")
    @Builder.Default
    private List<OfferApproval> offerApprovals = new ArrayList<>();

    @OneToOne(mappedBy = "candidate")
    private RecommendationPool recommendationPool;

    @PrePersist
    public void prePersist() {
        if (id == null) {
            id = java.util.UUID.randomUUID().toString();
        }
    }
}
