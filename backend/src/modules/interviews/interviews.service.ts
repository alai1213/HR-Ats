import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { FeishuService } from '@/infrastructure/feishu/feishu.service';
import { EmailService } from '@/infrastructure/email/email.service';
import { CreateInterviewDto, QueryInterviewDto } from './dto/interview.dto';
import { paginate } from '@/common/dto/pagination.dto';

@Injectable()
export class InterviewsService {
  constructor(
    private prisma: PrismaService,
    private feishuService: FeishuService,
    private emailService: EmailService,
  ) {}

  async findAll(query: QueryInterviewDto) {
    const { page = 1, pageSize = 20, candidateId, interviewerId } = query;
    const where: any = {};
    if (candidateId) where.candidateId = candidateId;
    if (interviewerId) where.interviewerId = interviewerId;

    const [data, total] = await Promise.all([
      this.prisma.interview.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          candidate: { select: { id: true, name: true } },
          interviewer: { select: { id: true, name: true, email: true } },
          feishuCalendarEvent: true,
        },
        orderBy: { scheduledAt: 'desc' },
      }),
      this.prisma.interview.count({ where }),
    ]);

    return paginate(data, total, page, pageSize);
  }

  async findOne(id: string) {
    const interview = await this.prisma.interview.findUnique({
      where: { id },
      include: {
        candidate: true,
        interviewer: { select: { id: true, name: true, email: true } },
        feishuCalendarEvent: true,
        feedbacks: true,
      },
    });
    if (!interview) throw new NotFoundException('面试记录不存在');
    return interview;
  }

  async create(dto: CreateInterviewDto, userId: string) {
    const candidate = await this.prisma.candidate.findUnique({
      where: { id: dto.candidateId },
      include: { position: true },
    });
    if (!candidate) throw new NotFoundException('候选人不存在');

    const interviewer = await this.prisma.user.findUnique({
      where: { id: dto.interviewerId },
    });
    if (!interviewer) throw new NotFoundException('面试官不存在');

    const interview = await this.prisma.interview.create({
      data: {
        candidateId: dto.candidateId,
        round: dto.round,
        scheduledAt: new Date(dto.scheduledAt),
        startTime: new Date(dto.startTime),
        endTime: new Date(dto.endTime),
        interviewerId: dto.interviewerId,
        mode: dto.mode,
        notes: dto.notes,
      },
      include: {
        candidate: true,
        interviewer: { select: { id: true, name: true, email: true } },
      },
    });

    if (dto.syncFeishu !== false) {
      const feishuEvent = await this.feishuService.createCalendarEvent({
        summary: `面试 - ${candidate.name} - ${candidate.position?.title || ''}`,
        startTime: new Date(dto.startTime),
        endTime: new Date(dto.endTime),
        attendeeEmails: [interviewer.email],
        description: dto.notes,
      });

      await this.prisma.feishuCalendarEvent.create({
        data: {
          interviewId: interview.id,
          eventId: feishuEvent.eventId,
          calendarLink: feishuEvent.calendarLink,
        },
      });
    }

    await this.emailService.sendByTemplate('INTERVIEW_SCHEDULED', interviewer.email, {
      interviewerName: interviewer.name,
      candidateName: candidate.name,
      positionTitle: candidate.position?.title || '',
      interviewTime: new Date(dto.startTime).toLocaleString('zh-CN'),
      interviewMode: dto.mode === 'ONLINE' ? '线上' : '线下',
    });

    await this.prisma.auditLog.create({
      data: {
        userId,
        action: 'CREATE',
        module: 'interview',
        targetId: interview.id,
        targetType: 'interview',
      },
    });

    return this.findOne(interview.id);
  }
}
