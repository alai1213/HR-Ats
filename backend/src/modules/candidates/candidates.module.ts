import { Module } from '@nestjs/common';
import { CandidatesController } from './candidates.controller';
import { CandidatesService } from './candidates.service';
import { CandidateRepository } from '@/infrastructure/repositories/candidate.repository';
import { CANDIDATE_REPOSITORY } from '@/domain/repositories/candidate.repository.interface';

@Module({
  controllers: [CandidatesController],
  providers: [
    CandidatesService,
    { provide: CANDIDATE_REPOSITORY, useClass: CandidateRepository },
  ],
  exports: [CandidatesService],
})
export class CandidatesModule {}
