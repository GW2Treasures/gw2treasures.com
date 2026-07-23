# syntax=docker/dockerfile:1.25@sha256:0adf442eae370b6087e08edc7c50b552d80ddf261576f4ebd6421006b2461f12

ARG node_version=24.18.0-alpine3.23@sha256:595398b0081eacda8e1c4c5b97b76cd1020e4d58a8ebcb4843b9bca1e79e7436
# renovate: datasource=npm packageName=pnpm
ARG pnpm_version=11.16.0

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
FROM mcr.microsoft.com/playwright:v1.61.1-jammy@sha256:7b86926fff94374389e8e1f4fdc5c76d050d4a06a7886bb537bf412b20e2b71e AS tester
ARG pnpm_version
WORKDIR /app

ENV CI=true

COPY --link --from=source /source/out/json/ .

# install dependencies
RUN npm i -g pnpm@${pnpm_version} && pnpm install --frozen-lockfile

# add source
COPY --link --from=source /source/out/full/ .

CMD [ "pnpm", "run", "e2e", "--log-prefix=none" ]
