import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { InterviewsService } from './interviews.service';
import { CreateInterviewDto, QueryInterviewDto } from './dto/interview.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RbacGuard } from '@/common/guards/rbac.guard';
import { Permissions } from '@/common/decorators/roles.decorator';
import { CurrentUser, AuthUser } from '@/common/decorators/current-user.decorator';

@ApiTags('面试管理')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RbacGuard)
@Controller('interviews')
export class InterviewsController {
  constructor(private interviewsService: InterviewsService) {}

  @Get()
  @Permissions('interview:create', 'candidate:read:all', 'candidate:read:assigned')
  @ApiOperation({ summary: '获取面试列表' })
  findAll(@Query() query: QueryInterviewDto) {
    return this.interviewsService.findAll(query);
  }

  @Get(':id')
  @Permissions('interview:create', 'candidate:read:all')
  @ApiOperation({ summary: '获取面试详情' })
  findOne(@Param('id') id: string) {
    return this.interviewsService.findOne(id);
  }

  @Post()
  @Permissions('interview:create')
  @ApiOperation({ summary: '创建面试（支持飞书日历同步）' })
  create(@Body() dto: CreateInterviewDto, @CurrentUser() user: AuthUser) {
    return this.interviewsService.create(dto, user.id);
  }
}
