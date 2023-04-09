ARG node_version=18-alpine


FROM node:${node_version} AS source
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /source
RUN npm i -g turbo
COPY . .
RUN turbo prune --scope=worker --docker

# Install dependencies only when needed
FROM node:${node_version} AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY --from=source /source/out/json/ .
COPY --from=source /source/out/package-lock.json package-lock.json

RUN npm ci --omit=dev

# Rebuild the source code only when needed
FROM node:${node_version} AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY --from=source /source/out/json/ .
COPY --from=source /source/out/package-lock.json package-lock.json

# install dev dependencies
RUN npm ci --include=dev

# add source
COPY --from=source /source/out/full/ .

# build source
RUN npm run prisma -w worker
RUN npm run build -w worker

# Production image, copy all the files and run next
FROM node:${node_version} AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 worker

COPY --from=deps --chown=worker:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=worker:nodejs /app/apps/worker/lib ./lib
COPY --from=builder --chown=worker:nodejs /app/apps/worker/prisma ./prisma/
COPY --from=builder --chown=worker:nodejs /app/node_modules/.prisma ./node_modules/.prisma

USER worker

EXPOSE 3000

ENV PORT 3000

CMD [ "node", "lib/index.js" ]
