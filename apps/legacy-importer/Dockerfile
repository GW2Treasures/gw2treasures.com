# syntax=docker/dockerfile:1.12

ARG node_version=22.11.0-alpine
# renovate: datasource=npm packageName=turbo
ARG turbo_version=2.3.2


# common base for all stages
FROM node:${node_version} AS base
ENV CI=true
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat


# create pruned source files
FROM base AS source
ARG turbo_version
WORKDIR /source
COPY --link package.json pnpm-*.yaml ./
RUN corepack enable && corepack install
COPY --link . .
RUN pnpx turbo@${turbo_version} prune legacy-importer --docker


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# add package.json and lockfile
COPY --link --from=source /source/out/json/ .

# install dev dependencies
RUN corepack enable && pnpm install --frozen-lockfile

# add source
COPY --link --from=source /source/out/full/ .

# build source
RUN pnpm run build --filter=legacy-importer


# Production image, COPY --link all the files and run next
FROM base AS runner
ENV NODE_ENV=production
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 worker

COPY --link --from=builder --chown=1001:1001 /app .

USER worker

CMD [ "node", "apps/legacy-importer/lib/index.js" ]
