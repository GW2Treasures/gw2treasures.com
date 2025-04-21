# syntax=docker/dockerfile:1.15

ARG node_version=22.14.0-alpine3.21
# renovate: datasource=npm packageName=turbo
ARG turbo_version=2.5.0
# renovate: datasource=npm packageName=sharp
ARG sharp_version=0.34.1
# renovate: datasource=npm packageName=pnpm
ARG pnpm_version=10.9.0


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
RUN apk add --no-cache libc6-compat
WORKDIR /app
ENV SKIP_LINT=true
ENV SKIP_TYPES=true

COPY --link --from=source /source/out/json/ .
RUN npm i -g pnpm@${pnpm_version}

# copy dependencies and source
COPY --link --from=dependencies /app .
COPY --link --from=source /source/out/full/ .

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
