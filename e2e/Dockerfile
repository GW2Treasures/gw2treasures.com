# syntax=docker/dockerfile:1.13

ARG node_version=22.13.0-alpine3.20


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
RUN pnpx turbo@${turbo_version} prune e2e --docker


# final image
FROM mcr.microsoft.com/playwright:v1.49.1-jammy AS tester
WORKDIR /app

ENV CI=true

COPY --link --from=source /source/out/json/ .

# install dependencies
RUN corepack enable && pnpm install --frozen-lockfile

# add source
COPY --link --from=source /source/out/full/ .

CMD [ "pnpm", "run", "e2e", "--log-prefix=none" ]
