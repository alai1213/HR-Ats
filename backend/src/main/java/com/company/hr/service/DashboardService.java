package com.company.hr.service;

import com.company.hr.dto.dashboard.*;
import com.company.hr.entity.Candidate;
import com.company.hr.entity.Position;
import com.company.hr.enums.CandidateStage;
import com.company.hr.enums.OfferApprovalStatus;
import com.company.hr.repository.CandidateRepository;
import com.company.hr.repository.InterviewRepository;
import com.company.hr.repository.OfferApprovalRepository;
import com.company.hr.repository.PositionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final CandidateRepository candidateRepository;
    private final PositionRepository positionRepository;
    private final InterviewRepository interviewRepository;
    private final OfferApprovalRepository offerApprovalRepository;

    @Transactional(readOnly = true)
    public DashboardOverview getOverview() {
        long totalCandidates = candidateRepository.count();
        long totalPositions = positionRepository.count();
        long totalInterviews = interviewRepository.count();
        long pendingOffers = offerApprovalRepository.findAll().stream()
                .filter(o -> o.getStatus() == OfferApprovalStatus.HR_SUBMITTED || o.getStatus() == OfferApprovalStatus.MANAGER_APPROVED)
                .count();

        LocalDateTime todayStart = LocalDateTime.of(LocalDate.now(), LocalTime.MIN);
        LocalDateTime todayEnd = LocalDateTime.of(LocalDate.now(), LocalTime.MAX);
        long todayInterviews = interviewRepository.findAll().stream()
                .filter(i -> i.getScheduledAt() != null
                        && !i.getScheduledAt().isBefore(todayStart)
                        && !i.getScheduledAt().isAfter(todayEnd))
                .count();

        return DashboardOverview.builder()
                .totalCandidates(totalCandidates)
                .totalPositions(totalPositions)
                .totalInterviews(totalInterviews)
                .pendingOffers(pendingOffers)
                .todayInterviews(todayInterviews)
                .build();
    }

    @Transactional(readOnly = true)
    public FunnelResponse getFunnel() {
        List<Candidate> candidates = candidateRepository.findAll();
        Map<String, Long> stageCounts = candidates.stream()
                .collect(Collectors.groupingBy(c -> c.getStage().name(), Collectors.counting()));

        List<FunnelStage> stages = stageCounts.entrySet().stream()
                .map(e -> FunnelStage.builder().stage(e.getKey()).count(e.getValue()).build())
                .sorted((a, b) -> Long.compare(b.getCount(), a.getCount()))
                .collect(Collectors.toList());

        return FunnelResponse.builder().stages(stages).build();
    }

    @Transactional(readOnly = true)
    public EfficiencyMetrics getEfficiency() {
        List<Candidate> candidates = candidateRepository.findAll();

        double avgDaysPerStage = 0.0;
        if (!candidates.isEmpty()) {
            double totalDays = candidates.stream()
                    .filter(c -> c.getCreatedAt() != null && c.getUpdatedAt() != null)
                    .mapToLong(c -> ChronoUnit.DAYS.between(c.getCreatedAt(), c.getUpdatedAt()))
                    .sum();
            avgDaysPerStage = totalDays / candidates.size();
        }

        long totalOffers = offerApprovalRepository.count();
        long acceptedOffers = offerApprovalRepository.findAll().stream()
                .filter(o -> o.getStatus() == OfferApprovalStatus.OFFER_SENT || o.getStatus() == OfferApprovalStatus.HR_CONFIRMED)
                .count();
        double offerAcceptanceRate = totalOffers == 0 ? 0.0 : (double) acceptedOffers / totalOffers * 100;

        long totalFeedbacks = candidateRepository.findAll().stream()
                .flatMap(c -> c.getInterviewFeedbacks().stream())
                .count();
        long passFeedbacks = candidateRepository.findAll().stream()
                .flatMap(c -> c.getInterviewFeedbacks().stream())
                .filter(f -> f.getResult() == com.company.hr.enums.FeedbackResult.PASS)
                .count();
        double interviewPassRate = totalFeedbacks == 0 ? 0.0 : (double) passFeedbacks / totalFeedbacks * 100;

        return EfficiencyMetrics.builder()
                .avgDaysPerStage(avgDaysPerStage)
                .offerAcceptanceRate(offerAcceptanceRate)
                .interviewPassRate(interviewPassRate)
                .build();
    }

    @Transactional(readOnly = true)
    public List<ChannelStat> getChannels() {
        List<Candidate> candidates = candidateRepository.findAll();
        Map<String, Long> sourceCounts = candidates.stream()
                .collect(Collectors.groupingBy(c -> c.getSource().name(), Collectors.counting()));

        return sourceCounts.entrySet().stream()
                .map(e -> ChannelStat.builder().source(e.getKey()).count(e.getValue()).build())
                .sorted((a, b) -> Long.compare(b.getCount(), a.getCount()))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PositionCompletion> getPositions() {
        List<Position> positions = positionRepository.findAll();
        return positions.stream()
                .map(p -> {
                    double rate = p.getHeadcount() == 0 ? 0.0 : (double) p.getHiredCount() / p.getHeadcount() * 100;
                    return PositionCompletion.builder()
                            .positionTitle(p.getTitle())
                            .headcount(p.getHeadcount())
                            .hiredCount(p.getHiredCount())
                            .completionRate(rate)
                            .build();
                })
                .sorted((a, b) -> Double.compare(b.getCompletionRate(), a.getCompletionRate()))
                .collect(Collectors.toList());
    }
}
