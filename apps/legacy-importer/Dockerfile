# syntax=docker/dockerfile:1.28@sha256:bb22d9815c728170f72750f4e5b0d672e06176142e1d602c7e66c050100b7e5b

ARG node_version=24.22.0-alpine3.23@sha256:e44c87c7dd212720eb00469aeac89504ca2be77b8f0d6dbffb30665d5fcc59e1
# renovate: datasource=npm packageName=turbo
ARG turbo_version=2.11.8
# renovate: datasource=npm packageName=pnpm
ARG pnpm_version=12.11.2


# common base for all stages
FROM node:${node_version} AS base
ENV CI=true
ENV PNPM_VERIFY_DEPS_BEFORE_RUN=false
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat


# create pruned source files
FROM base AS source
ARG turbo_version
ARG pnpm_version
WORKDIR /source
COPY --link package.json pnpm-*.yaml ./
RUN npm i -g pnpm@${pnpm_version} turbo@${turbo_version}
COPY --link . .
RUN turbo prune legacy-importer --docker


# Rebuild the source code only when needed
FROM base AS builder
ARG pnpm_version
WORKDIR /app

# add package.json and lockfile
COPY --link --from=source /source/out/json/ .

# install dev dependencies
RUN npm i -g pnpm@${pnpm_version} && pnpm install --frozen-lockfile

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
