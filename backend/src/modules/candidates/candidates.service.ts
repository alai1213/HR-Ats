import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ICandidateRepository, CANDIDATE_REPOSITORY } from '@/domain/repositories/candidate.repository.interface';
import { paginate } from '@/common/dto/pagination.dto';
import {
  BatchUpdateCandidateDto,
  CreateCandidateDto,
  QueryCandidateDto,
  UpdateCandidateDto,
  UpdateStageDto,
} from './dto/candidate.dto';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { EmailService } from '@/infrastructure/email/email.service';

@Injectable()
export class CandidatesService {
  constructor(
    @Inject(CANDIDATE_REPOSITORY) private candidateRepo: ICandidateRepository,
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  async findAll(query: QueryCandidateDto) {
    const { data, total } = await this.candidateRepo.findAll(query);
    return paginate(data, total, query.page!, query.pageSize!);
  }

  async findOne(id: string) {
    const candidate = await this.candidateRepo.findById(id);
    if (!candidate) throw new NotFoundException('候选人不存在');
    return candidate;
  }

  async create(dto: CreateCandidateDto, userId: string) {
    const candidate = await this.candidateRepo.create(dto);
    await this.logAudit(userId, 'CREATE', 'candidate', candidate.id);
    return candidate;
  }

  async update(id: string, dto: UpdateCandidateDto, userId: string) {
    await this.findOne(id);
    const candidate = await this.candidateRepo.update(id, dto);
    await this.logAudit(userId, 'UPDATE', 'candidate', id);
    return candidate;
  }

  async updateStage(id: string, dto: UpdateStageDto, userId: string) {
    const candidate = await this.findOne(id);
    const updated = await this.candidateRepo.update(id, { stage: dto.stage });
    await this.logAudit(userId, 'STAGE_CHANGE', 'candidate', id, { stage: dto.stage });

    if (candidate.email) {
      await this.emailService.sendByTemplate('STATUS_CHANGED', candidate.email, {
        candidateName: candidate.name,
        newStage: dto.stage,
      });
    }
    return updated;
  }

  async batchUpdate(dto: BatchUpdateCandidateDto, userId: string) {
    const data: any = {};
    if (dto.stage) data.stage = dto.stage;
    if (dto.ownerId) data.ownerId = dto.ownerId;
    const count = await this.candidateRepo.batchUpdate(dto.ids, data);
    await this.logAudit(userId, 'BATCH_UPDATE', 'candidate', dto.ids.join(','), data);
    return { updated: count };
  }

  async remove(id: string, userId: string) {
    await this.findOne(id);
    await this.candidateRepo.delete(id);
    await this.logAudit(userId, 'DELETE', 'candidate', id);
  }

  private async logAudit(
    userId: string,
    action: string,
    module: string,
    targetId: string,
    detail?: any,
  ) {
    await this.prisma.auditLog.create({
      data: { userId, action, module, targetId, targetType: module, detail },
    });
  }
}
