# 前端编译构建指南

## 环境要求

- Node.js 20+
- npm 10+
- Docker (可选)

## 前端编译命令

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

## Docker 镜像构建

```bash
cd frontend
docker build -t hr-ats-frontend:latest .
```

## 完整 CI 命令

```bash
cd frontend
npm ci
npm run build
docker build -t hr-ats-frontend:latest .
```
