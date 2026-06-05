import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IPositionRepository, POSITION_REPOSITORY } from '@/domain/repositories/position.repository.interface';
import { paginate } from '@/common/dto/pagination.dto';
import { CreatePositionDto, QueryPositionDto, UpdatePositionDto } from './dto/position.dto';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';

@Injectable()
export class PositionsService {
  constructor(
    @Inject(POSITION_REPOSITORY) private positionRepo: IPositionRepository,
    private prisma: PrismaService,
  ) {}

  async findAll(query: QueryPositionDto) {
    const { data, total } = await this.positionRepo.findAll(query);
    return paginate(data, total, query.page!, query.pageSize!);
  }

  async findOne(id: string) {
    const position = await this.positionRepo.findById(id);
    if (!position) throw new NotFoundException('职位不存在');
    return position;
  }

  async create(dto: CreatePositionDto, userId: string) {
    const position = await this.positionRepo.create(dto);
    await this.logAudit(userId, 'CREATE', 'position', position.id);
    return position;
  }

  async update(id: string, dto: UpdatePositionDto, userId: string) {
    await this.findOne(id);
    const position = await this.positionRepo.update(id, dto);
    await this.logAudit(userId, 'UPDATE', 'position', id);
    return position;
  }

  async remove(id: string, userId: string) {
    await this.findOne(id);
    await this.positionRepo.delete(id);
    await this.logAudit(userId, 'DELETE', 'position', id);
  }

  private async logAudit(userId: string, action: string, module: string, targetId: string) {
    await this.prisma.auditLog.create({
      data: { userId, action, module, targetId, targetType: module },
    });
  }
}
