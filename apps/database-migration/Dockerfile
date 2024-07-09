# syntax=docker/dockerfile:1.8

ARG node_version=20.15.0-alpine
# renovate: datasource=npm packageName=prisma
ARG prisma_version=5.16.2

FROM node:${node_version} AS source
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 worker

ARG prisma_version
RUN npm i -g prisma@${prisma_version}

COPY --link --chown=1001:1001 packages/database/prisma ./prisma

USER worker

EXPOSE 3000

ENV PORT 3000

CMD [ "prisma", "migrate", "deploy" ]
