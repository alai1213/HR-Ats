import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FeedbacksService } from './feedbacks.service';
import { CreateFeedbackDto, InviteFeedbackDto } from './dto/feedback.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RbacGuard } from '@/common/guards/rbac.guard';
import { Permissions } from '@/common/decorators/roles.decorator';
import { CurrentUser, AuthUser } from '@/common/decorators/current-user.decorator';

@ApiTags('面试评价')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RbacGuard)
@Controller('feedbacks')
export class FeedbacksController {
  constructor(private feedbacksService: FeedbacksService) {}

  @Get('candidate/:candidateId')
  @Permissions('feedback:read:all', 'feedback:read:own')
  @ApiOperation({ summary: '获取候选人面评历史' })
  findByCandidate(@Param('candidateId') candidateId: string) {
    return this.feedbacksService.findByCandidate(candidateId);
  }

  @Post()
  @Permissions('feedback:write')
  @ApiOperation({ summary: '填写面试评价' })
  create(@Body() dto: CreateFeedbackDto, @CurrentUser() user: AuthUser) {
    return this.feedbacksService.create(dto, user.id);
  }

  @Post('invite')
  @Permissions('feedback:write', 'interview:create')
  @ApiOperation({ summary: '邀请面试官填写面评' })
  invite(@Body() dto: InviteFeedbackDto) {
    return this.feedbacksService.invite(dto);
  }
}
