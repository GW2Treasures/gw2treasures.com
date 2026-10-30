# syntax=docker/dockerfile:1.28@sha256:bb22d9815c728170f72750f4e5b0d672e06176142e1d602c7e66c050100b7e5b

ARG node_version=26.13.0-alpine3.23@sha256:e6c03d42b46af3b1e98207e59f06a43cfe5efd3ec4b4d3d9802bddf04f833374
# renovate: datasource=npm packageName=prisma
ARG prisma_version=7.10.1

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
