import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const roles = [
    { id: 'role-hr-001', name: 'HR', code: 'HR', description: '人力资源专员' },
    { id: 'role-int-001', name: '面试官', code: 'INTERVIEWER', description: '面试官' },
    { id: 'role-mgr-001', name: '用人经理', code: 'HIRING_MANAGER', description: '用人经理' },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { code: role.code },
      update: {},
      create: role,
    });
  }

  const permissions = [
    { code: 'candidate:read:all', name: '查看所有候选人', module: 'candidate' },
    { code: 'candidate:write', name: '编辑候选人', module: 'candidate' },
    { code: 'candidate:delete', name: '删除候选人', module: 'candidate' },
    { code: 'candidate:read:assigned', name: '查看分配候选人', module: 'candidate' },
    { code: 'candidate:advance', name: '推进流程', module: 'candidate' },
    { code: 'interview:create', name: '发起面试', module: 'interview' },
    { code: 'feedback:write', name: '填写面评', module: 'feedback' },
    { code: 'feedback:read:all', name: '查看全部面评', module: 'feedback' },
    { code: 'feedback:read:own', name: '查看自己面评', module: 'feedback' },
    { code: 'position:create', name: '创建职位', module: 'position' },
    { code: 'position:write', name: '编辑职位', module: 'position' },
    { code: 'position:read', name: '查看职位', module: 'position' },
    { code: 'dashboard:read', name: '查看数据看板', module: 'dashboard' },
    { code: 'recommendation:write', name: '加入推荐池', module: 'recommendation' },
    { code: 'offer:approve', name: 'Offer审批', module: 'offer' },
    { code: 'system:manage', name: '系统管理', module: 'system' },
  ];

  for (const perm of permissions) {
    await prisma.permission.upsert({
      where: { code: perm.code },
      update: {},
      create: { name: perm.name, code: perm.code, module: perm.module },
    });
  }

  const hrRole = await prisma.role.findUnique({ where: { code: 'HR' } });
  const intRole = await prisma.role.findUnique({ where: { code: 'INTERVIEWER' } });
  const mgrRole = await prisma.role.findUnique({ where: { code: 'HIRING_MANAGER' } });

  const allPerms = await prisma.permission.findMany();
  const permMap = Object.fromEntries(allPerms.map((p) => [p.code, p.id]));

  const hrPerms = [
    'candidate:read:all', 'candidate:write', 'candidate:delete',
    'interview:create', 'feedback:write', 'feedback:read:all',
    'position:create', 'position:write', 'position:read',
    'dashboard:read', 'recommendation:write', 'offer:approve', 'system:manage',
  ];
  const intPerms = ['candidate:read:assigned', 'feedback:write', 'feedback:read:own'];
  const mgrPerms = ['candidate:read:all', 'feedback:read:all', 'position:read', 'candidate:advance', 'dashboard:read', 'offer:approve'];

  for (const code of hrPerms) {
    if (hrRole && permMap[code]) {
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: hrRole.id, permissionId: permMap[code] } },
        update: {},
        create: { roleId: hrRole.id, permissionId: permMap[code] },
      });
    }
  }
  for (const code of intPerms) {
    if (intRole && permMap[code]) {
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: intRole.id, permissionId: permMap[code] } },
        update: {},
        create: { roleId: intRole.id, permissionId: permMap[code] },
      });
    }
  }
  for (const code of mgrPerms) {
    if (mgrRole && permMap[code]) {
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: mgrRole.id, permissionId: permMap[code] } },
        update: {},
        create: { roleId: mgrRole.id, permissionId: permMap[code] },
      });
    }
  }

  const passwordHash = await bcrypt.hash('Admin@123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@company.com' },
    update: {},
    create: {
      email: 'admin@company.com',
      passwordHash,
      name: '系统管理员',
      department: '人力资源部',
    },
  });

  if (hrRole) {
    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: admin.id, roleId: hrRole.id } },
      update: {},
      create: { userId: admin.id, roleId: hrRole.id },
    });
  }

  const templates = [
    { code: 'INTERVIEW_SCHEDULED', name: '面试安排通知', subject: '【面试安排】{{candidateName}}', body: '您好 {{interviewerName}}，面试安排：{{candidateName}} {{interviewTime}}' },
    { code: 'FEEDBACK_INVITE', name: '面评邀请', subject: '【面评填写】{{candidateName}}', body: '请填写面评：{{feedbackLink}}' },
    { code: 'OFFER_SENT', name: 'Offer发放', subject: '【Offer】{{candidateName}}', body: 'Offer已发放，薪资：{{salary}}' },
    { code: 'STATUS_CHANGED', name: '状态变更', subject: '【状态变更】{{candidateName}}', body: '状态变更为：{{newStage}}' },
  ];

  for (const tpl of templates) {
    await prisma.emailTemplate.upsert({
      where: { code: tpl.code },
      update: {},
      create: tpl,
    });
  }

  console.log('Seed completed. Admin: admin@company.com / Admin@123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
