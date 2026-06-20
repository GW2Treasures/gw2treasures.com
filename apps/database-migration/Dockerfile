# syntax=docker/dockerfile:1.25@sha256:0adf442eae370b6087e08edc7c50b552d80ddf261576f4ebd6421006b2461f12

ARG node_version=24.17.0-alpine3.23@sha256:7c078d435026a97c8ff97b00d70e2f6ec6298a440e25a9485a9af414d5d37009
# renovate: datasource=npm packageName=prisma
ARG prisma_version=7.8.0

FROM node:${node_version}
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 worker

ARG prisma_version
RUN npm i prisma@${prisma_version} && npm cache clean --force

COPY --link --chown=1001:1001 packages/database/prisma ./prisma
COPY --link --chown=1001:1001 packages/database/prisma.config.ts .

USER worker

CMD [ "node_modules/.bin/prisma", "migrate", "deploy" ]
