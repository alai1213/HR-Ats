# HR ATS 招聘管理系统（重构版）

企业内部 ATS（Applicant Tracking System）招聘管理系统，后端采用 Java Spring Boot，前端采用 Next.js 15。

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | Next.js 15, TypeScript, TailwindCSS, Radix UI, React Hook Form, TanStack Query, Zustand |
| 后端 | Spring Boot 3, Java 17, Spring Data JPA, Spring Security, JWT, MariaDB |
| 部署 | Docker Compose, Kubernetes |

## 项目结构

```
HR/
├── backend/                    # Java Spring Boot 后端
│   ├── src/main/java/          # 业务源码
│   ├── src/main/resources/     # 配置文件
│   ├── Dockerfile              # 后端镜像构建
│   └── pom.xml                 # Maven 依赖
├── frontend/                   # Next.js 15 前端
│   ├── app/                    # 页面路由
│   ├── components/ui/          # UI 组件
│   ├── lib/                    # API、Store、工具
│   ├── Dockerfile              # 前端镜像构建
│   └── package.json
├── k8s/                        # Kubernetes 部署清单
├── docker-compose.yml          # 本地 Docker 编排
├── init.sql                    # MariaDB 初始化 SQL
└── README.md
```

## 分支说明

- `main`：完整项目（前后端 + 部署配置）
- `backend`：仅 Java 后端源码 + 部署配置
- `frontend`：仅 Node 前端源码 + 部署配置

## 快速开始

### Docker Compose（推荐）

```bash
docker-compose up -d
```

- 前端：http://localhost:3000
- 后端 API：http://localhost:4000/api/v1
- Swagger 文档：http://localhost:4000/api/docs

默认账号：`admin@company.com` / `Admin@123`

### 本地开发

**1. 启动基础设施**

```bash
docker-compose up -d mariadb minio
```

**2. 后端**

```bash
cd backend
cp .env.example .env
mvn spring-boot:run
```

**3. 前端**

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

## 核心功能

- 角色权限：HR / 面试官 / 用人经理，RBAC 细粒度控制
- 招聘流程：待筛选 -> 简历评估 -> HR初试 -> 业务面 -> 终面 -> Offer -> 入职
- 职位管理、候选人管理、面试管理、面评管理
- Offer 审批、推荐池、数据看板
- 系统管理、操作日志、邮件模板

## Kubernetes 部署

```bash
kubectl apply -f k8s/
```

## 环境变量

详见 `backend/.env.example` 和 `frontend/.env.example`。
