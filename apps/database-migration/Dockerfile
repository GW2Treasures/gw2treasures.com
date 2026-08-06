# syntax=docker/dockerfile:1.26@sha256:ecfaec9ed6d810b56388c508f4121597bfbba70d41a6dfeee4d8cad5f295fc32

ARG node_version=24.19.0-alpine3.23@sha256:244cc2b53f46f9e876304391d17682b0ddae9ac33491f4857e25e35a36ba7995
# renovate: datasource=npm packageName=prisma
ARG prisma_version=7.9.1

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
