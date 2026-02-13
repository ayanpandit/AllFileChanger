FROM node:20-bookworm-slim

WORKDIR /app

# Install OS deps needed for sharp when prebuilt binaries are unavailable
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    libvips \
 && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

ENV NODE_ENV=production
ENV PORT=5002

EXPOSE 5002

CMD ["npm", "start"]
