# syntax=docker/dockerfile:1.11

ARG node_version=22.11.0-alpine
# renovate: datasource=npm packageName=turbo
ARG turbo_version=2.2.3
# renovate: datasource=npm packageName=sharp
ARG sharp_version=0.33.5


# common base for all stages
FROM node:${node_version} AS base
ENV CI=true
ENV NEXT_TELEMETRY_DISABLED=1
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat


# create pruned source files
FROM --platform=$BUILDPLATFORM base AS source
ARG turbo_version
WORKDIR /source
COPY --link package.json pnpm-*.yaml ./
RUN corepack enable && corepack install
COPY --link . .
RUN pnpx turbo@${turbo_version} prune web --docker


# Install dependencies (on TARGETPLATFORM)
FROM base AS dependencies
WORKDIR /app

# add package.json and lockfile
COPY --link --from=source /source/out/json/ .

RUN corepack enable && pnpm install --frozen-lockfile


# Build application on BUILDPLATFORM for speed
FROM --platform=$BUILDPLATFORM base AS builder
ARG TARGETPLATFORM
RUN apk add --no-cache libc6-compat
WORKDIR /app
ENV SKIP_LINT=true
ENV SKIP_TYPES=true

COPY --link --from=source /source/out/json/ .
RUN corepack enable && corepack install

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
