# ── Build Stage ───────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY . .
COPY .env .env.tmp
RUN sed '/^DATABASE_URL/d' .env.tmp > .env && rm .env.tmp

ENV DATABASE_URL="file:/app/data/database.sqlite"

RUN npm ci
RUN npm run db:generate
RUN npm run build

# ── Production Stage ──────────────────────────────────────────────────────────
FROM node:20-alpine AS production

WORKDIR /app

ENV DATABASE_URL=file:/app/data/database.sqlite

COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./prisma.config.ts

RUN npm ci --only=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.env ./.env

# # Create data directory for SQLite
# RUN mkdir -p /app/data

EXPOSE 3000

# Run migrations then start server
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
