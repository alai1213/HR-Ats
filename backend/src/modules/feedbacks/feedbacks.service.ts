import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { EmailService } from '@/infrastructure/email/email.service';
import { CreateFeedbackDto, InviteFeedbackDto } from './dto/feedback.dto';

@Injectable()
export class FeedbacksService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  async findByCandidate(candidateId: string) {
    return this.prisma.interviewFeedback.findMany({
      where: { candidateId },
      include: {
        evaluator: { select: { id: true, name: true } },
        interview: { select: { id: true, round: true, scheduledAt: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(dto: CreateFeedbackDto, evaluatorId: string) {
    const interview = await this.prisma.interview.findUnique({
      where: { id: dto.interviewId },
    });
    if (!interview) throw new NotFoundException('面试记录不存在');

    return this.prisma.interviewFeedback.create({
      data: { ...dto, evaluatorId },
      include: {
        evaluator: { select: { id: true, name: true } },
        interview: true,
      },
    });
  }

  async invite(dto: InviteFeedbackDto) {
    const interview = await this.prisma.interview.findUnique({
      where: { id: dto.interviewId },
      include: {
        candidate: true,
        interviewer: true,
      },
    });
    if (!interview) throw new NotFoundException('面试记录不存在');

    const interviewer = await this.prisma.user.findUnique({
      where: { id: dto.interviewerId },
    });
    if (!interviewer) throw new NotFoundException('面试官不存在');

    const feedbackLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/interviews/${dto.interviewId}/feedback`;

    await this.emailService.sendByTemplate('FEEDBACK_INVITE', interviewer.email, {
      interviewerName: interviewer.name,
      candidateName: interview.candidate.name,
      interviewTime: interview.scheduledAt.toLocaleString('zh-CN'),
      feedbackLink,
    });

    return { message: '面评邀请已发送' };
  }
}
