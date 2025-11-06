FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json ./
COPY yarn.lock ./
RUN yarn install --frozen-lockfile

# Build stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Create user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# ✅ Copy standalone server
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

# ✅ Copy static assets
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# ✅ Copy public folder  
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000
CMD ["node", "server.js"]
