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

# Generate Prisma client
RUN pnpm --filter backend run build

# Deploy backend to an isolated folder for production
RUN pnpm --filter backend --prod deploy /pruned


FROM node:20-alpine AS runner
# Remove built-in npm to fix Snyk vulnerabilities (not needed in production)
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm
WORKDIR /app

# Copy the isolated backend package
COPY --from=builder /pruned ./

EXPOSE 3030

CMD ["node", "src/server.js"]
