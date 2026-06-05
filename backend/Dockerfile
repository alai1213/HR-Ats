FROM node:20-slim AS builder

WORKDIR /app

# Prisma 需要 OpenSSL，Alpine 镜像容易缺库导致引擎加载失败
RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY prisma ./prisma/
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-slim AS runner

WORKDIR /app
ENV NODE_ENV=production

RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

EXPOSE 4000

# migrate deploy 需要 prisma/migrations；seed 写入角色/权限/管理员
CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma db seed && node dist/main"]
