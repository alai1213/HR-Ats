import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserRepository } from '@/infrastructure/repositories/user.repository';
import { USER_REPOSITORY } from '@/domain/repositories/user.repository.interface';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    { provide: USER_REPOSITORY, useClass: UserRepository },
  ],
  exports: [UsersService],
})
export class UsersModule {}
