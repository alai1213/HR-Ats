import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CandidatesService } from './candidates.service';
import {
  BatchUpdateCandidateDto,
  CreateCandidateDto,
  QueryCandidateDto,
  UpdateCandidateDto,
  UpdateStageDto,
} from './dto/candidate.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RbacGuard } from '@/common/guards/rbac.guard';
import { Permissions } from '@/common/decorators/roles.decorator';
import { CurrentUser, AuthUser } from '@/common/decorators/current-user.decorator';

@ApiTags('候选人管理')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RbacGuard)
@Controller('candidates')
export class CandidatesController {
  constructor(private candidatesService: CandidatesService) {}

  @Get()
  @Permissions('candidate:read:all', 'candidate:read:assigned')
  @ApiOperation({ summary: '获取候选人列表' })
  findAll(@Query() query: QueryCandidateDto) {
    return this.candidatesService.findAll(query);
  }

  @Get(':id')
  @Permissions('candidate:read:all', 'candidate:read:assigned')
  @ApiOperation({ summary: '获取候选人详情' })
  findOne(@Param('id') id: string) {
    return this.candidatesService.findOne(id);
  }

  @Post()
  @Permissions('candidate:write')
  @ApiOperation({ summary: '创建候选人' })
  create(@Body() dto: CreateCandidateDto, @CurrentUser() user: AuthUser) {
    return this.candidatesService.create(dto, user.id);
  }

  @Patch(':id')
  @Permissions('candidate:write')
  @ApiOperation({ summary: '更新候选人' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCandidateDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.candidatesService.update(id, dto, user.id);
  }

  @Patch(':id/stage')
  @Permissions('candidate:write', 'candidate:advance')
  @ApiOperation({ summary: '更新候选人阶段（支持拖拽）' })
  updateStage(
    @Param('id') id: string,
    @Body() dto: UpdateStageDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.candidatesService.updateStage(id, dto, user.id);
  }

  @Post('batch')
  @Permissions('candidate:write')
  @ApiOperation({ summary: '批量操作候选人' })
  batchUpdate(@Body() dto: BatchUpdateCandidateDto, @CurrentUser() user: AuthUser) {
    return this.candidatesService.batchUpdate(dto, user.id);
  }

  @Delete(':id')
  @Permissions('candidate:delete')
  @ApiOperation({ summary: '删除候选人' })
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.candidatesService.remove(id, user.id);
  }
}
