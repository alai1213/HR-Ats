# 编译构建指南

本文档提供前后端在 Jenkins 中的编译命令及流水线示例。

---

## 环境要求

- JDK 17+
- Maven 3.9+
- Node.js 20+
- npm 10+
- Docker (可选，用于镜像构建)

---

## 后端编译（Java / Maven）

```bash
cd backend

# 标准打包（跳过测试，加速构建）
mvn clean package -DskipTests

# 完整构建（包含单元测试）
mvn clean verify

# 仅编译不打包
mvn clean compile

# 产物位置
# target/hr-ats-backend-1.0.0.jar
```

### 后端 Dockerfile 独立构建

```bash
cd backend
docker build -t hr-ats-backend:${VERSION} .
```

---

## 前端编译（Node / Next.js）

```bash
cd frontend

# 安装依赖
npm ci

# 开发模式
npm run dev

# 生产构建（生成 .next/standalone 输出）
npm run build

# 产物位置
# .next/standalone/          # Docker 运行时使用的独立输出
# .next/static/              # 静态资源
```

### 前端 Dockerfile 独立构建

```bash
cd frontend
docker build -t hr-ats-frontend:${VERSION} .
```

---

## 一键全量构建（本地或 CI）

```bash
# 后端
mvn -f backend/pom.xml clean package -DskipTests

# 前端
cd frontend && npm ci && npm run build

# Docker Compose 全量构建
docker-compose build
```

---

## Jenkins Pipeline 示例

详见项目根目录 `Jenkinsfile`。

### 核心 Stage 说明

| Stage | 说明 |
|-------|------|
| Checkout | 拉取代码 |
| Backend Build | `mvn -f backend/pom.xml clean package -DskipTests` |
| Frontend Build | `cd frontend && npm ci && npm run build` |
| Docker Build | `docker-compose build` 或分别构建前后端镜像 |
| Deploy | `kubectl apply -f k8s/` 或 `docker-compose up -d` |
