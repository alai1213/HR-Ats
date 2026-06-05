import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SystemService } from './system.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RbacGuard } from '@/common/guards/rbac.guard';
import { Permissions } from '@/common/decorators/roles.decorator';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

class QueryAuditLogDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  pageSize?: number = 20;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  module?: string;
}

@ApiTags('系统管理')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RbacGuard)
@Controller('system')
export class SystemController {
  constructor(private systemService: SystemService) {}

  @Get('roles')
  @Permissions('system:manage')
  @ApiOperation({ summary: '获取角色列表' })
  getRoles() {
    return this.systemService.getRoles();
  }

  @Get('permissions')
  @Permissions('system:manage')
  @ApiOperation({ summary: '获取权限列表' })
  getPermissions() {
    return this.systemService.getPermissions();
  }

  @Get('audit-logs')
  @Permissions('system:manage')
  @ApiOperation({ summary: '获取操作日志' })
  getAuditLogs(@Query() query: QueryAuditLogDto) {
    return this.systemService.getAuditLogs({
      page: query.page ?? 1,
      pageSize: query.pageSize ?? 20,
      module: query.module,
    });
  }

  @Get('email-templates')
  @Permissions('system:manage')
  @ApiOperation({ summary: '获取邮件模板' })
  getEmailTemplates() {
    return this.systemService.getEmailTemplates();
  }

  @Patch('email-templates/:id')
  @Permissions('system:manage')
  @ApiOperation({ summary: '更新邮件模板' })
  updateEmailTemplate(
    @Param('id') id: string,
    @Body() body: { subject?: string; body?: string; isActive?: boolean },
  ) {
    return this.systemService.updateEmailTemplate(id, body);
  }
}
