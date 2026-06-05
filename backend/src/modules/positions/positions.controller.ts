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
import { PositionsService } from './positions.service';
import { CreatePositionDto, QueryPositionDto, UpdatePositionDto } from './dto/position.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RbacGuard } from '@/common/guards/rbac.guard';
import { Permissions } from '@/common/decorators/roles.decorator';
import { CurrentUser, AuthUser } from '@/common/decorators/current-user.decorator';

@ApiTags('职位管理')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RbacGuard)
@Controller('positions')
export class PositionsController {
  constructor(private positionsService: PositionsService) {}

  @Get()
  @Permissions('position:read')
  @ApiOperation({ summary: '获取职位列表' })
  findAll(@Query() query: QueryPositionDto) {
    return this.positionsService.findAll(query);
  }

  @Get(':id')
  @Permissions('position:read')
  @ApiOperation({ summary: '获取职位详情' })
  findOne(@Param('id') id: string) {
    return this.positionsService.findOne(id);
  }

  @Post()
  @Permissions('position:create')
  @ApiOperation({ summary: '创建职位' })
  create(@Body() dto: CreatePositionDto, @CurrentUser() user: AuthUser) {
    return this.positionsService.create(dto, user.id);
  }

  @Patch(':id')
  @Permissions('position:write')
  @ApiOperation({ summary: '更新职位' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePositionDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.positionsService.update(id, dto, user.id);
  }

  @Delete(':id')
  @Permissions('position:write')
  @ApiOperation({ summary: '删除职位' })
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.positionsService.remove(id, user.id);
  }
}
