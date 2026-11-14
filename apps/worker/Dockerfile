# syntax=docker/dockerfile:1.29@sha256:572cebbc2b15e6f84c077742952674889cb63cd5e9b80abdffcbe587b6f19183

ARG node_version=26.13.1-alpine3.24@sha256:6bd9ab43c0ec0190ca7b2d193906cb8b7edf6e7f4afa43ddeccd6452710bffb5
# renovate: datasource=npm packageName=turbo
ARG turbo_version=2.11.10
# renovate: datasource=npm packageName=sharp
ARG sharp_version=0.35.5
# renovate: datasource=npm packageName=pnpm
ARG pnpm_version=12.18.0


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
ARG git_sha
ENV SENTRY_RELEASE=${git_sha}
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

CMD [ "node", "--enable-source-maps", "index.js" ]
