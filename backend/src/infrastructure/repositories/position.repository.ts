import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IPositionRepository } from '@/domain/repositories/position.repository.interface';

@Injectable()
export class PositionRepository implements IPositionRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(filters: any) {
    const { page = 1, pageSize = 20, keyword, department, status, ownerId } = filters;
    const where: any = {};

    if (keyword) {
      where.OR = [
        { title: { contains: keyword } },
        { department: { contains: keyword } },
      ];
    }
    if (department) where.department = department;
    if (status) where.status = status;
    if (ownerId) where.ownerId = ownerId;

    const [data, total] = await Promise.all([
      this.prisma.position.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { owner: { select: { id: true, name: true, email: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.position.count({ where }),
    ]);

    return { data, total };
  }

  async findById(id: string) {
    return this.prisma.position.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        candidates: { select: { id: true, name: true, stage: true } },
      },
    });
  }

  async create(data: any) {
    return this.prisma.position.create({
      data,
      include: { owner: { select: { id: true, name: true, email: true } } },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.position.update({
      where: { id },
      data,
      include: { owner: { select: { id: true, name: true, email: true } } },
    });
  }

  async delete(id: string) {
    await this.prisma.position.delete({ where: { id } });
  }
}
