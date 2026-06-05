# HR ATS 招聘管理系统（内部版）

企业内部使用的 ATS（Applicant Tracking System）招聘管理系统，统一管理候选人、面试流程、面评、职位需求、招聘数据分析及飞书面试安排。

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | Next.js 15, TypeScript, TailwindCSS, Shadcn/UI, React Hook Form, TanStack Query, Zustand |
| 后端 | NestJS, MariaDB, Prisma ORM, JWT, RBAC |
| 存储 | MinIO（简历/附件） |
| 部署 | Docker Compose, Kubernetes |
| 第三方 | 飞书开放平台, SMTP 邮件 |

## 项目结构

```
HR/
├── backend/                    # NestJS 后端
│   ├── prisma/
│   │   ├── schema.prisma       # 数据库 Schema
│   │   └── seed.ts             # 种子数据
│   └── src/
│       ├── domain/             # 领域层（Repository 接口）
│       ├── infrastructure/     # 基础设施（Prisma, MinIO, 飞书, 邮件）
│       ├── modules/            # 业务模块（Controller + Service + DTO）
│       │   ├── auth/
│       │   ├── users/
│       │   ├── positions/
│       │   ├── candidates/
│       │   ├── interviews/
│       │   ├── feedbacks/
│       │   ├── offers/
│       │   ├── recommendations/
│       │   ├── dashboard/
│       │   ├── system/
│       │   └── files/
│       └── common/             # 守卫、装饰器、通用 DTO
├── frontend/                   # Next.js 15 前端
│   ├── app/
│   │   ├── login/              # 登录页
│   │   └── (app)/              # 主应用页面
│   │       ├── dashboard/      # 数据看板
│   │       ├── positions/      # 职位管理
│   │       ├── candidates/     # 候选人总看板 + 详情
│   │       ├── interviews/     # 面试管理
│   │       ├── recommendations/# 推荐池
│   │       ├── offers/         # Offer审批
│   │       ├── analytics/      # 数据分析
│   │       └── system/         # 系统管理
│   ├── components/ui/          # Shadcn UI 组件
│   └── lib/                    # API、Store、常量
├── k8s/                        # Kubernetes 部署清单
├── docker-compose.yml          # 本地 Docker 编排
├── init.sql                    # 数据库初始化（角色/权限/模板）
└── README.md
```

## 核心功能

- **角色权限**：HR / 面试官 / 用人经理，RBAC 细粒度控制
- **招聘流程**：待筛选 → 简历评估 → HR初试 → 业务面 → 终面 → Offer → 入职（支持拖拽/批量改状态）
- **职位管理**：搜索、分页、部门/状态/负责人筛选
- **候选人管理**：卡片/表格双模式、批量操作、详情页、简历 PDF 自动解析
- **面试管理**：创建面试、飞书日历同步、邮件通知
- **面评管理**：1-5 分评分、邀请填写、历史记录
- **推荐池**：HR 专属、支持导出
- **Offer 审批**：HR提交 → 经理审批 → HR确认 → 发放
- **数据看板**：招聘漏斗、效率指标、渠道效果、职位完成率
- **系统管理**：用户/角色/操作日志/邮件模板

## 快速开始

### 方式一：Docker Compose（推荐）

```bash
cd HR
docker-compose up -d
```

服务地址：
- 前端：http://localhost:3000
- 后端 API：http://localhost:4000/api/v1
- Swagger 文档：http://localhost:4000/api/docs
- MinIO 控制台：http://localhost:9001

默认账号：`admin@company.com` / `Admin@123`

### 方式二：本地开发

**1. 启动基础设施**

```bash
docker-compose up -d mariadb minio
```

**2. 后端**

```bash
cd backend
cp .env.example .env
npm install
npx prisma migrate dev --name init
npx prisma db seed
npm run start:dev
```

**3. 前端**

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

### 运行测试

```bash
cd backend
npm test
```

## API 文档

启动后端后访问 Swagger：http://localhost:4000/api/docs

主要 API 端点：

| 模块 | 端点 | 说明 |
|------|------|------|
| 认证 | `POST /auth/login` | 登录 |
| 职位 | `GET/POST/PATCH/DELETE /positions` | 职位 CRUD |
| 候选人 | `GET/POST/PATCH/DELETE /candidates` | 候选人 CRUD |
| 候选人 | `PATCH /candidates/:id/stage` | 更新阶段 |
| 候选人 | `POST /candidates/batch` | 批量操作 |
| 面试 | `POST /interviews` | 创建面试（飞书同步） |
| 面评 | `POST /feedbacks` | 填写面评 |
| Offer | `POST /offers` | 提交审批 |
| 推荐池 | `POST /recommendations` | 加入推荐池 |
| 看板 | `GET /dashboard/overview` | 数据总览 |
| 文件 | `POST /files/resume/:candidateId` | 上传解析简历 |
| 系统 | `GET /system/roles` | 角色管理 |

## 数据库表

| 表名 | 说明 |
|------|------|
| users | 用户 |
| roles / permissions | 角色权限 |
| positions | 职位 |
| candidates | 候选人 |
| candidate_tags / candidate_files | 标签/附件 |
| interviews | 面试 |
| interview_feedbacks | 面评 |
| offer_approvals | Offer审批 |
| recommendation_pool | 推荐池 |
| email_templates | 邮件模板 |
| audit_logs | 操作日志 |
| feishu_calendar_events | 飞书日历 |

## Kubernetes 部署

```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/secrets.yaml      # 请先修改密钥
kubectl apply -f k8s/mariadb.yaml
kubectl apply -f k8s/minio.yaml
kubectl apply -f k8s/backend.yaml
kubectl apply -f k8s/frontend.yaml
```

## 环境变量

详见 `backend/.env.example` 和 `frontend/.env.example`。

关键配置：
- `DATABASE_URL`：MariaDB 连接
- `JWT_SECRET`：JWT 密钥
- `FEISHU_APP_ID/SECRET`：飞书开放平台
- `SMTP_*`：邮件服务
- `MINIO_*`：对象存储

## 架构说明

后端采用 **Clean Architecture**：
- `domain/`：Repository 接口（依赖倒置）
- `infrastructure/`：Prisma、MinIO、飞书、邮件实现
- `modules/`：用例层（Service）+ 表现层（Controller + DTO）

横切关注点：
- `JwtAuthGuard`：JWT 认证
- `RbacGuard`：RBAC 权限校验
- `ValidationPipe`：DTO 校验
- `Swagger`：API 文档自动生成
