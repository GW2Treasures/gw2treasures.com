# syntax=docker/dockerfile:1.18

ARG node_version=22.19.0-alpine3.21
# renovate: datasource=npm packageName=turbo
ARG turbo_version=2.5.6
# renovate: datasource=npm packageName=sharp
ARG sharp_version=0.34.3
# renovate: datasource=npm packageName=pnpm
ARG pnpm_version=10.16.1


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
RUN turbo prune worker --docker


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
RUN pnpm run build --filter=worker


# Production image, COPY --link all the files and run next
FROM base AS runner
ARG sharp_version
ENV NODE_ENV=production
WORKDIR /app

RUN apk add --no-cache bind-tools \
  && addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 worker \
  && npm i sharp@${sharp_version} && npm cache clean --force

COPY --link --from=builder --chown=1001:1001 /app/apps/worker/dist .

USER worker
EXPOSE 3000
ENV PORT=3000

CMD [ "node", "index.js" ]
