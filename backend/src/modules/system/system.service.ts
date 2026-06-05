import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';

@Injectable()
export class SystemService {
  constructor(private prisma: PrismaService) {}

  async getRoles() {
    return this.prisma.role.findMany({
      include: {
        permissions: { include: { permission: true } },
        _count: { select: { users: true } },
      },
    });
  }

  async getPermissions() {
    return this.prisma.permission.findMany({ orderBy: { module: 'asc' } });
  }

  async getAuditLogs(params: { page: number; pageSize: number; module?: string }) {
    const { page, pageSize, module } = params;
    const where = module ? { module } : {};

    const [data, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { user: { select: { id: true, name: true, email: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async getEmailTemplates() {
    return this.prisma.emailTemplate.findMany({ orderBy: { name: 'asc' } });
  }

  async updateEmailTemplate(id: string, data: { subject?: string; body?: string; isActive?: boolean }) {
    return this.prisma.emailTemplate.update({ where: { id }, data });
  }
}
