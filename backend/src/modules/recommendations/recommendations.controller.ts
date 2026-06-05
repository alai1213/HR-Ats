import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RecommendationsService } from './recommendations.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RbacGuard } from '@/common/guards/rbac.guard';
import { Permissions } from '@/common/decorators/roles.decorator';
import { CurrentUser, AuthUser } from '@/common/decorators/current-user.decorator';
import { IsArray, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class AddRecommendationDto {
  @ApiProperty()
  @IsUUID()
  candidateId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  highlight?: string;
}

class BatchAddDto {
  @ApiProperty({ type: [String] })
  @IsArray()
  @IsUUID('4', { each: true })
  candidateIds: string[];
}

@ApiTags('推荐池')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RbacGuard)
@Controller('recommendations')
export class RecommendationsController {
  constructor(private recommendationsService: RecommendationsService) {}

  @Get()
  @Permissions('recommendation:write', 'candidate:read:all')
  @ApiOperation({ summary: '获取推荐池列表' })
  findAll() {
    return this.recommendationsService.findAll();
  }

  @Post()
  @Permissions('recommendation:write')
  @ApiOperation({ summary: '加入推荐池' })
  add(@Body() dto: AddRecommendationDto, @CurrentUser() user: AuthUser) {
    return this.recommendationsService.add(dto.candidateId, user.id, dto.highlight);
  }

  @Post('batch')
  @Permissions('recommendation:write')
  @ApiOperation({ summary: '批量加入推荐池' })
  batchAdd(@Body() dto: BatchAddDto, @CurrentUser() user: AuthUser) {
    return this.recommendationsService.batchAdd(dto.candidateIds, user.id);
  }

  @Delete(':candidateId')
  @Permissions('recommendation:write')
  @ApiOperation({ summary: '从推荐池移除' })
  remove(@Param('candidateId') candidateId: string) {
    return this.recommendationsService.remove(candidateId);
  }
}
