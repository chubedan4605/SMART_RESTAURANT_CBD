FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
COPY pnpm-lock.yaml ./
COPY turbo.json ./
# Install pnpm
RUN npm install -g pnpm

# Copy workspace config
COPY pnpm-workspace.yaml ./

# Copy backend app
COPY apps/be/package.json apps/be/
# We also need to copy Prisma schema if it exists for prisma generate
COPY apps/be/prisma apps/be/prisma/

# Install dependencies for backend
RUN pnpm --filter backend install --frozen-lockfile

# Copy backend source
COPY apps/be apps/be/

# Build/Generate Prisma client if needed
RUN cd apps/be && pnpm run build || true

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/apps/be/node_modules ./apps/be/node_modules
COPY --from=builder /app/apps/be/package.json ./apps/be/
COPY --from=builder /app/apps/be/src ./apps/be/src
COPY --from=builder /app/apps/be/prisma ./apps/be/prisma

WORKDIR /app/apps/be
EXPOSE 3030

CMD ["npm", "start"]
