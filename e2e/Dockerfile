# syntax=docker/dockerfile:1.6

ARG node_version=20.11.0-alpine

FROM node:${node_version} AS source
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /source
RUN npm i -g turbo
COPY --link . .
RUN turbo prune --scope=e2e --docker

# Rebuild the source code only when needed
FROM mcr.microsoft.com/playwright:v1.41.2-jammy AS tester
WORKDIR /app

ENV CI=1

COPY --link --from=source /source/out/json/ .
COPY --link --from=source /source/out/package-lock.json package-lock.json

# install dev dependencies
RUN npm ci --include=dev

# add source
COPY --link --from=source /source/out/full/ .

CMD [ "npm", "run", "e2e", "--", "--log-prefix=none" ]
