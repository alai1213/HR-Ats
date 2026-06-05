-- HR ATS 初始化数据
-- 默认角色与权限

-- 角色
INSERT INTO roles (id, name, code, description, created_at) VALUES
  ('role-hr-001', 'HR', 'HR', '人力资源专员，拥有全部招聘管理权限', NOW()),
  ('role-int-001', '面试官', 'INTERVIEWER', '面试官，可查看分配候选人并填写面评', NOW()),
  ('role-mgr-001', '用人经理', 'HIRING_MANAGER', '用人经理，可查看所属职位候选人并推进流程', NOW());

-- 权限
INSERT INTO permissions (id, name, code, module, description, created_at) VALUES
  ('perm-001', '查看所有候选人', 'candidate:read:all', 'candidate', '查看所有候选人', NOW()),
  ('perm-002', '编辑候选人', 'candidate:write', 'candidate', '编辑候选人信息', NOW()),
  ('perm-003', '删除候选人', 'candidate:delete', 'candidate', '删除候选人', NOW()),
  ('perm-004', '查看分配候选人', 'candidate:read:assigned', 'candidate', '查看分配给自己的候选人', NOW()),
  ('perm-005', '发起面试', 'interview:create', 'interview', '创建面试安排', NOW()),
  ('perm-006', '填写面评', 'feedback:write', 'feedback', '填写面试评价', NOW()),
  ('perm-007', '查看全部面评', 'feedback:read:all', 'feedback', '查看全部面试评价', NOW()),
  ('perm-008', '查看自己面评', 'feedback:read:own', 'feedback', '查看自己的面试评价', NOW()),
  ('perm-009', '创建职位', 'position:create', 'position', '创建招聘职位', NOW()),
  ('perm-010', '编辑职位', 'position:write', 'position', '编辑招聘职位', NOW()),
  ('perm-011', '查看职位', 'position:read', 'position', '查看招聘职位', NOW()),
  ('perm-012', '推进流程', 'candidate:advance', 'candidate', '推进候选人招聘流程', NOW()),
  ('perm-013', '查看数据看板', 'dashboard:read', 'dashboard', '查看招聘数据分析', NOW()),
  ('perm-014', '加入推荐池', 'recommendation:write', 'recommendation', '将候选人加入推荐池', NOW()),
  ('perm-015', 'Offer审批', 'offer:approve', 'offer', '审批Offer', NOW()),
  ('perm-016', '系统管理', 'system:manage', 'system', '用户与角色管理', NOW());

-- HR 角色权限
INSERT INTO role_permissions (role_id, permission_id) VALUES
  ('role-hr-001', 'perm-001'), ('role-hr-001', 'perm-002'), ('role-hr-001', 'perm-003'),
  ('role-hr-001', 'perm-005'), ('role-hr-001', 'perm-006'), ('role-hr-001', 'perm-007'),
  ('role-hr-001', 'perm-009'), ('role-hr-001', 'perm-010'), ('role-hr-001', 'perm-011'),
  ('role-hr-001', 'perm-013'), ('role-hr-001', 'perm-014'), ('role-hr-001', 'perm-015'),
  ('role-hr-001', 'perm-016');

-- 面试官角色权限
INSERT INTO role_permissions (role_id, permission_id) VALUES
  ('role-int-001', 'perm-004'), ('role-int-001', 'perm-006'), ('role-int-001', 'perm-008');

-- 用人经理角色权限
INSERT INTO role_permissions (role_id, permission_id) VALUES
  ('role-mgr-001', 'perm-001'), ('role-mgr-001', 'perm-007'), ('role-mgr-001', 'perm-011'),
  ('role-mgr-001', 'perm-012'), ('role-mgr-001', 'perm-013'), ('role-mgr-001', 'perm-015');

-- 默认管理员账号由 prisma seed 创建: admin@company.com / Admin@123

-- 邮件模板
INSERT INTO email_templates (id, name, code, subject, body, is_active, created_at, updated_at) VALUES
  ('tpl-001', '面试安排通知', 'INTERVIEW_SCHEDULED', '【面试安排】{{candidateName}} - {{positionTitle}}',
   '您好 {{interviewerName}}，\n\n已为您安排面试：\n候选人：{{candidateName}}\n职位：{{positionTitle}}\n时间：{{interviewTime}}\n方式：{{interviewMode}}\n\n请准时参加。', true, NOW(), NOW()),
  ('tpl-002', '面评邀请', 'FEEDBACK_INVITE', '【面评填写】{{candidateName}} 面试评价邀请',
   '您好 {{interviewerName}}，\n\n请为候选人 {{candidateName}} 填写面试评价。\n面试时间：{{interviewTime}}\n\n点击链接填写：{{feedbackLink}}', true, NOW(), NOW()),
  ('tpl-003', 'Offer发放通知', 'OFFER_SENT', '【Offer】{{candidateName}} Offer 发放通知',
   '候选人 {{candidateName}} 的 Offer 已发放。\n薪资：{{salary}}\n入职日期：{{startDate}}', true, NOW(), NOW()),
  ('tpl-004', '状态变更通知', 'STATUS_CHANGED', '【状态变更】{{candidateName}}',
   '候选人 {{candidateName}} 状态已变更为：{{newStage}}', true, NOW(), NOW());
