# syntax=docker/dockerfile:1.14

ARG node_version=22.14.0-alpine3.21
# renovate: datasource=npm packageName=pnpm
ARG pnpm_version=10.8.1

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
RUN turbo prune e2e --docker


# final image
FROM mcr.microsoft.com/playwright:v1.51.1-jammy AS tester
ARG pnpm_version
WORKDIR /app

ENV CI=true

COPY --link --from=source /source/out/json/ .

# install dependencies
RUN npm i -g pnpm@${pnpm_version} && pnpm install --frozen-lockfile

# add source
COPY --link --from=source /source/out/full/ .

CMD [ "pnpm", "run", "e2e", "--log-prefix=none" ]
