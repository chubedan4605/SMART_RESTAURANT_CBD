FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
COPY pnpm-lock.yaml ./
COPY turbo.json ./
# Install pnpm
RUN npm install -g pnpm@9

# Copy workspace config
COPY pnpm-workspace.yaml ./

# Copy backend app
COPY apps/be/package.json apps/be/


# Install dependencies for backend
RUN pnpm --filter backend install --no-frozen-lockfile

# Copy backend source
COPY apps/be apps/be/



FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/apps/be/node_modules ./apps/be/node_modules
COPY --from=builder /app/apps/be/package.json ./apps/be/
COPY --from=builder /app/apps/be/src ./apps/be/src


WORKDIR /app/apps/be
EXPOSE 3030

CMD ["npm", "start"]
