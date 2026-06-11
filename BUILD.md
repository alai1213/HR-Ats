# 后端编译构建指南

## 环境要求

- JDK 17+
- Maven 3.9+
- Docker (可选)

## 后端编译命令

```bash
cd backend

# 标准打包（跳过测试，加速构建）
mvn clean package -DskipTests

# 完整构建（包含单元测试）
mvn clean verify

# 仅编译不打包
mvn clean compile

# 产物位置：target/hr-ats-backend-1.0.0.jar
```

## Docker 镜像构建

```bash
cd backend
docker build -t hr-ats-backend:latest .
```

## 完整 CI 命令

```bash
mvn -f backend/pom.xml clean package -DskipTests
docker build -t hr-ats-backend:latest ./backend
```
