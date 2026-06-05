import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';

@Injectable()
export class RecommendationsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.recommendationPool.findMany({
      include: {
        candidate: {
          include: {
            position: { select: { id: true, title: true } },
            tags: true,
            files: { where: { isResume: true }, take: 1 },
          },
        },
        addedBy: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async add(candidateId: string, addedById: string, highlight?: string) {
    const candidate = await this.prisma.candidate.findUnique({
      where: { id: candidateId },
    });
    if (!candidate) throw new NotFoundException('候选人不存在');

    const existing = await this.prisma.recommendationPool.findUnique({
      where: { candidateId },
    });
    if (existing) throw new ConflictException('候选人已在推荐池中');

    return this.prisma.recommendationPool.create({
      data: { candidateId, addedById, highlight },
      include: {
        candidate: {
          include: {
            position: true,
            tags: true,
            files: { where: { isResume: true } },
          },
        },
      },
    });
  }

  async remove(candidateId: string) {
    await this.prisma.recommendationPool.delete({ where: { candidateId } });
  }

  async batchAdd(candidateIds: string[], addedById: string) {
    const results = [];
    for (const id of candidateIds) {
      try {
        const item = await this.add(id, addedById);
        results.push(item);
      } catch {
        // skip duplicates
      }
    }
    return { added: results.length };
  }
}
