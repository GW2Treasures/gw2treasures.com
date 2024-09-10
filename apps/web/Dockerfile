# syntax=docker/dockerfile:1.9

ARG node_version=20.17.0-alpine
# renovate: datasource=npm packageName=prisma
ARG prisma_version=5.19.1
# renovate: datasource=npm packageName=sharp
ARG sharp_version=0.33.5


# common base for all stages
FROM node:${node_version} AS base
ENV NODE_ENV=production
ENV CI=true
ENV NEXT_TELEMETRY_DISABLED=1


# create pruned source files
FROM --platform=$BUILDPLATFORM base AS source
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /source
COPY --link package*.json ./
RUN npm ci --workspaces=false && npm cache clean --force
COPY --link . .
RUN npx turbo prune web --docker


# Install dependencies (on TARGETPLATFORM)
FROM base AS dependencies
RUN apk add --no-cache libc6-compat
WORKDIR /app

# add package.json and lockfile
COPY --link --from=source /source/out/json/ .

RUN npm ci --include=dev --include=optional && npm cache clean --force


# Build application on BUILDPLATFORM for speed
FROM --platform=$BUILDPLATFORM base AS builder
ARG TARGETPLATFORM
ARG sharp_version
RUN apk add --no-cache libc6-compat
WORKDIR /app
ENV SKIP_LINT=true
ENV SKIP_TYPES=true

RUN npm install --os=linux --libc=musl --cpu=x64 sharp@${sharp_version} && npm cache clean --force

# copy dependencies and source
COPY --link --from=dependencies /app .
COPY --link --from=source /source/out/full/ .

RUN npm run build -- --filter=web


# Production image, COPY --link all the files and run next
FROM base AS runner
ARG prisma_version
RUN apk add --no-cache bind-tools
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --link --from=builder /app/apps/web/next.config.js .
COPY --link --from=builder /app/apps/web/package.json .

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --link --from=builder --chown=1001:1001 /app/apps/web/.next/standalone ./
COPY --link --from=builder --chown=1001:1001 /app/apps/web/.next/static ./apps/web/.next/static
COPY --link --from=builder --chown=1001:1001 /app/apps/web/public ./apps/web/public

# workaround for https://github.com/wooorm/starry-night/issues/9
COPY --link --from=builder --chown=1001:1001 /app/node_modules/vscode-oniguruma/release/onig.wasm /app/node_modules/vscode-oniguruma/release/onig.wasm

ENV HOSTNAME=0.0.0.0
ENV PORT=3000
USER nextjs
EXPOSE 3000

CMD [ "node", "apps/web/server.js" ]
