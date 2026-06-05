import { Module } from '@nestjs/common';
import { PositionsController } from './positions.controller';
import { PositionsService } from './positions.service';
import { PositionRepository } from '@/infrastructure/repositories/position.repository';
import { POSITION_REPOSITORY } from '@/domain/repositories/position.repository.interface';

@Module({
  controllers: [PositionsController],
  providers: [
    PositionsService,
    { provide: POSITION_REPOSITORY, useClass: PositionRepository },
  ],
  exports: [PositionsService],
})
export class PositionsModule {}
