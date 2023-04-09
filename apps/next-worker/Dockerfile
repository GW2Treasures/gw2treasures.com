ARG node_version=18-alpine

# Install dependencies only when needed
FROM node:${node_version} AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# Rebuild the source code only when needed
FROM node:${node_version} AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY --from=deps /app/package.json /app/package-lock.json* ./

# install dev dependencies
RUN npm ci --include=dev

# add prisma schema
COPY prisma prisma
RUN npm run prisma

# add source
COPY . .

# build source
RUN npm run build

# Production image, copy all the files and run next
FROM node:${node_version} AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 worker

COPY --from=deps --chown=worker:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=worker:nodejs /app/lib ./lib
COPY --from=builder --chown=worker:nodejs /app/prisma ./prisma/
COPY --from=builder --chown=worker:nodejs /app/node_modules/.prisma ./node_modules/.prisma

USER worker

EXPOSE 3000

ENV PORT 3000

CMD [ "node", "lib/index.js" ]
