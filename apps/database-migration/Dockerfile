# syntax=docker/dockerfile:1.9

ARG node_version=20.16.0-alpine
# renovate: datasource=npm packageName=prisma
ARG prisma_version=5.17.0

FROM node:${node_version} AS source
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 worker

ARG prisma_version
RUN npm i -g prisma@${prisma_version}

COPY --link --chown=1001:1001 packages/database/prisma ./prisma

USER worker

CMD [ "prisma", "migrate", "deploy" ]
