import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RbacGuard } from '@/common/guards/rbac.guard';
import { Permissions } from '@/common/decorators/roles.decorator';

@ApiTags('数据看板')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RbacGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('overview')
  @Permissions('dashboard:read')
  @ApiOperation({ summary: '获取数据看板总览' })
  getOverview() {
    return this.dashboardService.getOverview();
  }

  @Get('funnel')
  @Permissions('dashboard:read')
  @ApiOperation({ summary: '招聘漏斗' })
  getFunnel() {
    return this.dashboardService.getFunnel();
  }

  @Get('efficiency')
  @Permissions('dashboard:read')
  @ApiOperation({ summary: '招聘效率' })
  getEfficiency() {
    return this.dashboardService.getEfficiency();
  }

  @Get('channels')
  @Permissions('dashboard:read')
  @ApiOperation({ summary: '渠道效果' })
  getChannels() {
    return this.dashboardService.getChannelStats();
  }

  @Get('positions')
  @Permissions('dashboard:read')
  @ApiOperation({ summary: '职位完成情况' })
  getPositions() {
    return this.dashboardService.getPositionCompletion();
  }
}
