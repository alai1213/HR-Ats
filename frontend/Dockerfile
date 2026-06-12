# syntax=docker/dockerfile:1
# Frontend Dockerfile - Multi-stage build for Next.js standalone output

# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Accept build-time argument for NEXT_PUBLIC_ variables
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Install dependencies
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copy source code and build Next.js standalone output
COPY . .
RUN npm run build

# Stage 2: Runtime
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy standalone output and static files
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
# If your project has a public directory, uncomment the next line:
# COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["node", "server.js"]
