# syntax=docker/dockerfile:1.7

ARG node_version=20.11.1-alpine

FROM node:${node_version} AS source
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 worker

RUN npm i -g prisma

COPY --link --chown=1001:1001 packages/database/prisma ./prisma

USER worker

EXPOSE 3000

ENV PORT 3000

CMD [ "prisma", "migrate", "deploy" ]
