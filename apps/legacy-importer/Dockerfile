# syntax=docker/dockerfile:1.11

ARG node_version=20.18.0-alpine


# common base for all stages
FROM node:${node_version} AS base
ENV NODE_ENV=production
ENV CI=true


# create pruned source files
FROM base AS source
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /source
COPY --link package*.json ./
RUN npm ci --workspaces=false && npm cache clean --force
COPY --link . .
RUN npx turbo prune legacy-importer --docker


# Rebuild the source code only when needed
FROM base AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY --link --from=source /source/out/json/ .

# install dev dependencies
RUN npm ci --include=dev && npm cache clean --force

# add source
COPY --link --from=source /source/out/full/ .

# build source
RUN npm run build -- --filter=legacy-importer \
  && npm prune --production --workspaces --include-workspace-root


# Production image, COPY --link all the files and run next
FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 worker

COPY --link --from=builder --chown=1001:1001 /app .

USER worker

CMD [ "node", "apps/legacy-importer/lib/index.js" ]
