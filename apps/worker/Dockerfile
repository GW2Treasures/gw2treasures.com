# syntax=docker/dockerfile:1.9

ARG node_version=20.17.0-alpine
# renovate: datasource=npm packageName=sharp
ARG sharp_version=0.33.5


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
RUN npx turbo prune worker --docker


# Rebuild the source code only when needed
FROM base AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app

# add package.json and lockfile
COPY --link --from=source /source/out/json/ .

# install dev dependencies
RUN npm ci --include=dev && npm cache clean --force

# add source
COPY --link --from=source /source/out/full/ .

# build source
RUN npx turbo run build --filter=worker


# Production image, COPY --link all the files and run next
FROM base AS runner
ARG sharp_version
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
