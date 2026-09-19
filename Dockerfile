# Africa Invest — Cloud Run image.
# Scale-to-zero. CPU is billed only while serving requests.
FROM node:22-bookworm-slim AS base
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN node scripts/use-postgres-schema.mjs
ENV NEXT_TELEMETRY_DISABLED=1 \
    DATABASE_URL="postgresql://build:build@127.0.0.1:5432/build" \
    SESSION_SECRET="build-time-placeholder-secret-32chars" \
    APP_ENV=sandbox
RUN npx prisma generate && npm run build

FROM base AS migrate
COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json ./
COPY prisma ./prisma
COPY src/mock ./src/mock
COPY scripts ./scripts
COPY tsconfig.json ./
RUN node scripts/use-postgres-schema.mjs && npx prisma generate
ENV NODE_ENV=production
USER node
ENTRYPOINT ["node", "scripts/gcp-migrate.mjs"]

FROM base AS runner
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=8080 \
    HOSTNAME=0.0.0.0
RUN groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma
USER nextjs
EXPOSE 8080
CMD ["node", "server.js"]
