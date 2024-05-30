# syntax=docker/dockerfile:1.7

ARG node_version=20.14.0-alpine

FROM node:${node_version} AS source
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /source
RUN npm i -g turbo
COPY --link . .
RUN turbo prune --scope=legacy-importer --docker

# Rebuild the source code only when needed
FROM node:${node_version} AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY --link --from=source /source/out/json/ .
COPY --link --from=source /source/out/package-lock.json package-lock.json

# install dev dependencies
RUN npm ci --include=dev

# add source
COPY --link --from=source /source/out/full/ .

# build source
RUN npm run build -- --filter=legacy-importer...
RUN npm prune --production --workspaces --include-workspace-root

# Production image, COPY --link all the files and run next
FROM node:${node_version} AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 worker

COPY --link --from=builder --chown=1001:1001 /app .

USER worker

EXPOSE 3000

ENV PORT 3000

CMD [ "node", "apps/legacy-importer/lib/index.js" ]
