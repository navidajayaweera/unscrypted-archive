# ── Stage 1: Install dependencies ──────────────────────────────────
FROM node:20-slim AS deps

# Build tools needed for better-sqlite3 native bindings
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm ci

# ── Stage 2: Build ──────────────────────────────────────────────────
FROM node:20-slim AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN node_modules/.bin/prisma generate

# Build Next.js
RUN npm run build

# ── Stage 3: Production runner ──────────────────────────────────────
FROM node:20-slim AS runner

RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy everything needed to run
COPY --from=builder /app/node_modules     ./node_modules
COPY --from=builder /app/.next            ./.next
COPY --from=builder /app/public           ./public
COPY --from=builder /app/prisma           ./prisma
COPY --from=builder /app/src/generated    ./src/generated
COPY --from=builder /app/src/lib          ./src/lib
COPY --from=builder /app/package.json     ./package.json
COPY --from=builder /app/next.config.mjs  ./next.config.mjs
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/tsconfig.json    ./tsconfig.json

# Persistent data directories
RUN mkdir -p /app/data /app/public/uploads

COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["/docker-entrypoint.sh"]
