# syntax=docker/dockerfile:1.28@sha256:bb22d9815c728170f72750f4e5b0d672e06176142e1d602c7e66c050100b7e5b

ARG node_version=24.22.0-alpine3.23@sha256:e44c87c7dd212720eb00469aeac89504ca2be77b8f0d6dbffb30665d5fcc59e1
# renovate: datasource=npm packageName=turbo
ARG turbo_version=2.11.8
# renovate: datasource=npm packageName=sharp
ARG sharp_version=0.35.5
# renovate: datasource=npm packageName=pnpm
ARG pnpm_version=12.14.0


# common base for all stages
FROM node:${node_version} AS base
ENV CI=true
ENV NEXT_TELEMETRY_DISABLED=1
ENV PNPM_VERIFY_DEPS_BEFORE_RUN=false
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat


# create pruned source files
FROM --platform=$BUILDPLATFORM base AS source
ARG turbo_version
ARG pnpm_version
WORKDIR /source
COPY --link package.json pnpm-*.yaml ./
RUN npm i -g pnpm@${pnpm_version} turbo@${turbo_version}
COPY --link . .
RUN turbo prune web --docker


# Install dependencies (on TARGETPLATFORM)
FROM base AS dependencies
ARG pnpm_version
WORKDIR /app

# add package.json and lockfile
COPY --link --from=source /source/out/json/ .

RUN npm i -g pnpm@${pnpm_version} && pnpm install --frozen-lockfile


# Build application on BUILDPLATFORM for speed
FROM --platform=$BUILDPLATFORM base AS builder
ARG pnpm_version
ARG deployment_id
RUN apk add --no-cache libc6-compat
WORKDIR /app
ENV SKIP_TYPES=true

COPY --link --from=source /source/out/json/ .
RUN npm i -g pnpm@${pnpm_version}

# copy dependencies and source
COPY --link --from=dependencies /app .
COPY --link --from=source /source/out/full/ .

ENV DEPLOYMENT_ID=${deployment_id}
RUN pnpm run build --filter=web


# Production image, COPY --link all the files and run next
FROM base AS runner
ARG sharp_version
ENV NODE_ENV=production
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

RUN npm install sharp@${sharp_version} && npm cache clean --force

COPY --link --from=builder /app/apps/web/package.json .

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --link --from=builder --chown=1001:1001 /app/apps/web/.next/standalone ./
COPY --link --from=builder --chown=1001:1001 /app/apps/web/.next/static ./apps/web/.next/static
COPY --link --from=builder --chown=1001:1001 /app/apps/web/public ./apps/web/public

# workaround for https://github.com/wooorm/starry-night/issues/9
COPY --link --from=builder --chown=1001:1001 /app/packages/onig/dist/onig.wasm /app/packages/onig/dist/onig.wasm

ENV HOSTNAME=0.0.0.0
ENV PORT=3000
USER nextjs
EXPOSE 3000

CMD [ "node", "apps/web/server.js" ]
