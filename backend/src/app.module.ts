import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RbacGuard } from './common/guards/rbac.guard';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { PositionsModule } from './modules/positions/positions.module';
import { CandidatesModule } from './modules/candidates/candidates.module';
import { InterviewsModule } from './modules/interviews/interviews.module';
import { FeedbacksModule } from './modules/feedbacks/feedbacks.module';
import { OffersModule } from './modules/offers/offers.module';
import { RecommendationsModule } from './modules/recommendations/recommendations.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { SystemModule } from './modules/system/system.module';
import { FilesModule } from './modules/files/files.module';
import { EmailModule } from './infrastructure/email/email.module';
import { FeishuModule } from './infrastructure/feishu/feishu.module';
import { StorageModule } from './infrastructure/storage/storage.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    StorageModule,
    EmailModule,
    FeishuModule,
    AuthModule,
    UsersModule,
    PositionsModule,
    CandidatesModule,
    InterviewsModule,
    FeedbacksModule,
    OffersModule,
    RecommendationsModule,
    DashboardModule,
    SystemModule,
    FilesModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RbacGuard },
  ],
})
export class AppModule {}
