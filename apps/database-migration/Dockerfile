# syntax=docker/dockerfile:1.16

ARG node_version=22.16.0-alpine3.21
# renovate: datasource=npm packageName=prisma
ARG prisma_version=6.8.2

FROM node:${node_version}
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 worker

ARG prisma_version
RUN npm i -g prisma@${prisma_version} && npm cache clean --force

COPY --link --chown=1001:1001 packages/database/prisma ./prisma

USER worker

CMD [ "prisma", "migrate", "deploy" ]
