import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { CandidateSource, CandidateStage } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getFunnel() {
    const stages = [
      'PENDING_SCREENING',
      'RESUME_REVIEW',
      'HR_INTERVIEW',
      'BUSINESS_INTERVIEW',
      'FINAL_INTERVIEW',
      'OFFER_APPROVAL',
      'OFFER_SENT',
      'ONBOARDED',
    ] as CandidateStage[];

    const counts = await Promise.all(
      stages.map((stage) =>
        this.prisma.candidate.count({ where: { stage } }),
      ),
    );

    const total = await this.prisma.candidate.count();

    return {
      total,
      funnel: stages.map((stage, i) => ({ stage, count: counts[i] })),
    };
  }

  async getEfficiency() {
    const onboarded = await this.prisma.candidate.findMany({
      where: { stage: 'ONBOARDED' },
      select: { createdAt: true, updatedAt: true },
    });

    const offers = await this.prisma.candidate.count({
      where: { stage: { in: ['OFFER_SENT', 'ONBOARDED', 'OFFER_REJECTED'] } },
    });
    const offerAccepted = await this.prisma.candidate.count({
      where: { stage: { in: ['OFFER_SENT', 'ONBOARDED'] } },
    });
    const onboardedCount = onboarded.length;

    const avgCycle =
      onboarded.length > 0
        ? onboarded.reduce(
            (sum, c) => sum + (c.updatedAt.getTime() - c.createdAt.getTime()),
            0,
          ) /
          onboarded.length /
          (1000 * 60 * 60 * 24)
        : 0;

    const interviewCount = await this.prisma.interview.count();
    const candidateWithInterviews = await this.prisma.candidate.count({
      where: { interviews: { some: {} } },
    });

    return {
      avgRecruitmentDays: Math.round(avgCycle),
      avgInterviewRounds:
        candidateWithInterviews > 0
          ? Math.round((interviewCount / candidateWithInterviews) * 10) / 10
          : 0,
      offerAcceptanceRate:
        offers > 0 ? Math.round((offerAccepted / offers) * 100) : 0,
      onboardingRate:
        offerAccepted > 0
          ? Math.round((onboardedCount / offerAccepted) * 100)
          : 0,
    };
  }

  async getChannelStats() {
    const sources = Object.values(CandidateSource);
    const stats = await Promise.all(
      sources.map(async (source) => {
        const applied = await this.prisma.candidate.count({ where: { source } });
        const interviewed = await this.prisma.candidate.count({
          where: { source, interviews: { some: {} } },
        });
        const offered = await this.prisma.candidate.count({
          where: {
            source,
            stage: { in: ['OFFER_SENT', 'ONBOARDED', 'OFFER_REJECTED'] },
          },
        });
        const onboarded = await this.prisma.candidate.count({
          where: { source, stage: 'ONBOARDED' },
        });

        return {
          source,
          applied,
          interviewed,
          offered,
          onboarded,
          conversionRate:
            applied > 0 ? Math.round((onboarded / applied) * 100) : 0,
        };
      }),
    );
    return stats;
  }

  async getPositionCompletion() {
    const positions = await this.prisma.position.findMany({
      where: { status: 'OPEN' },
      select: {
        id: true,
        title: true,
        headcount: true,
        hiredCount: true,
        createdAt: true,
      },
    });

    return positions.map((p) => ({
      ...p,
      completionRate:
        p.headcount > 0 ? Math.round((p.hiredCount / p.headcount) * 100) : 0,
      remaining: Math.max(0, p.headcount - p.hiredCount),
    }));
  }

  async getOverview() {
    const [funnel, efficiency, channels, positions] = await Promise.all([
      this.getFunnel(),
      this.getEfficiency(),
      this.getChannelStats(),
      this.getPositionCompletion(),
    ]);

    return { funnel, efficiency, channels, positions };
  }
}
