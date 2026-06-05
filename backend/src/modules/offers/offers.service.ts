import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { EmailService } from '@/infrastructure/email/email.service';
import { ApproveOfferDto, CreateOfferDto } from './dto/offer.dto';

@Injectable()
export class OffersService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  async findAll() {
    return this.prisma.offerApproval.findMany({
      include: {
        candidate: { select: { id: true, name: true, email: true } },
        submitter: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByCandidate(candidateId: string) {
    return this.prisma.offerApproval.findMany({
      where: { candidateId },
      include: { submitter: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(dto: CreateOfferDto, submitterId: string) {
    return this.prisma.offerApproval.create({
      data: {
        candidateId: dto.candidateId,
        submitterId,
        salary: dto.salary,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        notes: dto.notes,
        status: 'HR_SUBMITTED',
      },
      include: {
        candidate: true,
        submitter: { select: { id: true, name: true } },
      },
    });
  }

  async approve(id: string, dto: ApproveOfferDto, userId: string) {
    const offer = await this.prisma.offerApproval.findUnique({
      where: { id },
      include: { candidate: true },
    });
    if (!offer) throw new NotFoundException('Offer审批记录不存在');

    const updated = await this.prisma.offerApproval.update({
      where: { id },
      data: {
        status: dto.status,
        approvalNotes: dto.approvalNotes,
      },
      include: {
        candidate: true,
        submitter: { select: { id: true, name: true } },
      },
    });

    if (dto.status === 'OFFER_SENT' && offer.candidate.email) {
      await this.emailService.sendByTemplate('OFFER_SENT', offer.candidate.email, {
        candidateName: offer.candidate.name,
        salary: offer.salary || '',
        startDate: offer.startDate?.toLocaleDateString('zh-CN') || '',
      });

      await this.prisma.candidate.update({
        where: { id: offer.candidateId },
        data: { stage: 'OFFER_SENT' },
      });
    }

    await this.prisma.auditLog.create({
      data: {
        userId,
        action: 'APPROVE',
        module: 'offer',
        targetId: id,
        targetType: 'offer',
        detail: { status: dto.status },
      },
    });

    return updated;
  }
}
