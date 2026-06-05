import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CandidatesService } from './candidates.service';
import { CANDIDATE_REPOSITORY } from '@/domain/repositories/candidate.repository.interface';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { EmailService } from '@/infrastructure/email/email.service';

describe('CandidatesService', () => {
  let service: CandidatesService;
  const mockRepo = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    batchUpdate: jest.fn(),
  };
  const mockPrisma = {
    auditLog: { create: jest.fn() },
  };
  const mockEmail = {
    sendByTemplate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CandidatesService,
        { provide: CANDIDATE_REPOSITORY, useValue: mockRepo },
        { provide: PrismaService, useValue: mockPrisma },
        { provide: EmailService, useValue: mockEmail },
      ],
    }).compile();

    service = module.get<CandidatesService>(CandidatesService);
    jest.clearAllMocks();
  });

  it('should return paginated candidates', async () => {
    mockRepo.findAll.mockResolvedValue({ data: [{ id: 'c1', name: '张三' }], total: 1 });

    const result = await service.findAll({ page: 1, pageSize: 20 });

    expect(result.data).toHaveLength(1);
    expect(result.total).toBe(1);
  });

  it('should throw NotFoundException when candidate not found', async () => {
    mockRepo.findById.mockResolvedValue(null);

    await expect(service.findOne('invalid')).rejects.toThrow(NotFoundException);
  });

  it('should update stage and send email', async () => {
    mockRepo.findById.mockResolvedValue({
      id: 'c1',
      name: '张三',
      email: 'zhang@example.com',
    });
    mockRepo.update.mockResolvedValue({ id: 'c1', stage: 'HR_INTERVIEW' });

    const result = await service.updateStage(
      'c1',
      { stage: 'HR_INTERVIEW' as any },
      'user-1',
    );

    expect(result.stage).toBe('HR_INTERVIEW');
    expect(mockEmail.sendByTemplate).toHaveBeenCalled();
  });
});
