# syntax=docker/dockerfile:1.23@sha256:2780b5c3bab67f1f76c781860de469442999ed1a0d7992a5efdf2cffc0e3d769

ARG node_version=24.14.1-alpine3.22@sha256:4f33c7804fa7775b87875f512e25e515692210bfdeafd715eb8bc441c364e2f6
# renovate: datasource=npm packageName=pnpm
ARG pnpm_version=10.33.0

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
FROM mcr.microsoft.com/playwright:v1.59.0-jammy@sha256:993f64042f2ebc3ad66601841b91f16335335a2f1c9126a51ca3c639f9e26ecb AS tester
ARG pnpm_version
WORKDIR /app

ENV CI=true

COPY --link --from=source /source/out/json/ .

# install dependencies
RUN npm i -g pnpm@${pnpm_version} && pnpm install --frozen-lockfile

# add source
COPY --link --from=source /source/out/full/ .

CMD [ "pnpm", "run", "e2e", "--log-prefix=none" ]
