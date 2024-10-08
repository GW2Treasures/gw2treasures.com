# syntax=docker/dockerfile:1.10

ARG node_version=20.18.0-alpine


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
RUN npx turbo prune e2e --docker


# final image
FROM mcr.microsoft.com/playwright:v1.48.0-jammy AS tester
WORKDIR /app

ENV CI=true

COPY --link --from=source /source/out/json/ .

# install dev dependencies
RUN npm ci --include=dev && npm cache clean --force

# add source
COPY --link --from=source /source/out/full/ .

CMD [ "npm", "run", "e2e", "--", "--log-prefix=none" ]
