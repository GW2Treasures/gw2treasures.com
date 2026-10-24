# syntax=docker/dockerfile:1.28@sha256:bb22d9815c728170f72750f4e5b0d672e06176142e1d602c7e66c050100b7e5b

ARG node_version=24.22.1-alpine3.23@sha256:0468540aa58203ff9e40c2aab3907c52644ab818af6176b1c70a026137dc92a2
# renovate: datasource=npm packageName=pnpm
ARG pnpm_version=12.15.0

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
FROM mcr.microsoft.com/playwright:v1.64.1-jammy@sha256:7e9f074b4b69f7c746865936ac7840733cf5dfc957f265a547f331e7b83922d7 AS tester
ARG pnpm_version
WORKDIR /app

ENV CI=true

COPY --link --from=source /source/out/json/ .

# install dependencies
RUN npm i -g pnpm@${pnpm_version} && pnpm install --frozen-lockfile

# add source
COPY --link --from=source /source/out/full/ .

CMD [ "pnpm", "run", "e2e", "--log-prefix=none" ]
