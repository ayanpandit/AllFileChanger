# ── AllFileChanger Node.js Backend ──────────────────────────────────────────
FROM node:20-alpine AS base

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# Copy source
COPY . .

# Non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Env
ENV NODE_ENV=production
ENV PORT=5001

EXPOSE 5001

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:5001/health || exit 1

CMD ["node", "server.js"]
