import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ICandidateRepository } from '@/domain/repositories/candidate.repository.interface';

@Injectable()
export class CandidateRepository implements ICandidateRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(filters: any) {
    const {
      page = 1,
      pageSize = 20,
      keyword,
      positionId,
      department,
      stage,
      source,
      ownerId,
      createdFrom,
      createdTo,
    } = filters;

    const where: any = {};

    if (keyword) {
      where.OR = [
        { name: { contains: keyword } },
        { phone: { contains: keyword } },
        { email: { contains: keyword } },
        { currentCompany: { contains: keyword } },
      ];
    }
    if (positionId) where.positionId = positionId;
    if (stage) where.stage = stage;
    if (source) where.source = source;
    if (ownerId) where.ownerId = ownerId;
    if (department) where.position = { department };
    if (createdFrom || createdTo) {
      where.createdAt = {};
      if (createdFrom) where.createdAt.gte = new Date(createdFrom);
      if (createdTo) where.createdAt.lte = new Date(createdTo);
    }

    const [data, total] = await Promise.all([
      this.prisma.candidate.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          position: { select: { id: true, title: true, department: true } },
          owner: { select: { id: true, name: true } },
          tags: true,
          files: { where: { isResume: true }, take: 1 },
        },
        orderBy: { updatedAt: 'desc' },
      }),
      this.prisma.candidate.count({ where }),
    ]);

    return { data, total };
  }

  async findById(id: string) {
    return this.prisma.candidate.findUnique({
      where: { id },
      include: {
        position: true,
        owner: { select: { id: true, name: true, email: true } },
        tags: true,
        files: true,
        interviews: {
          include: {
            interviewer: { select: { id: true, name: true } },
            feishuCalendarEvent: true,
          },
          orderBy: { scheduledAt: 'desc' },
        },
        interviewFeedbacks: {
          include: { evaluator: { select: { id: true, name: true } } },
          orderBy: { createdAt: 'desc' },
        },
        offerApprovals: { orderBy: { createdAt: 'desc' } },
      },
    });
  }

  async create(data: any) {
    const { tags, ...rest } = data;
    return this.prisma.candidate.create({
      data: {
        ...rest,
        tags: tags?.length
          ? { create: tags.map((tag: string) => ({ tag })) }
          : undefined,
      },
      include: {
        position: true,
        owner: { select: { id: true, name: true } },
        tags: true,
      },
    });
  }

  async update(id: string, data: any) {
    const { tags, ...rest } = data;
    if (tags) {
      await this.prisma.candidateTag.deleteMany({ where: { candidateId: id } });
    }
    return this.prisma.candidate.update({
      where: { id },
      data: {
        ...rest,
        tags: tags?.length
          ? { create: tags.map((tag: string) => ({ tag })) }
          : undefined,
      },
      include: {
        position: true,
        owner: { select: { id: true, name: true } },
        tags: true,
      },
    });
  }

  async delete(id: string) {
    await this.prisma.candidate.delete({ where: { id } });
  }

  async batchUpdate(ids: string[], data: any) {
    const result = await this.prisma.candidate.updateMany({
      where: { id: { in: ids } },
      data,
    });
    return result.count;
  }
}
