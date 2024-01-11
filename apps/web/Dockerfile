# syntax=docker/dockerfile:1.6

ARG node_version=20.10.0-alpine

FROM --platform=$BUILDPLATFORM node:${node_version} AS source
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /source
RUN npm i -g turbo
COPY --link . .
RUN turbo prune --scope=web --docker

# Install dependencies only when needed
FROM --platform=$BUILDPLATFORM node:${node_version} AS builder
ARG TARGETPLATFORM
RUN apk add --no-cache libc6-compat
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED 1

# Install dependencies based on the preferred package manager
COPY --link --from=source /source/out/json/ .
COPY --link --from=source /source/out/package-lock.json package-lock.json

RUN npm ci --include=dev --cpu $TARGETPLATFORM

COPY --link --from=source /source/out/full/ .

RUN npm ls sharp && npm run build -- --filter=web...

# Production image, COPY --link all the files and run next
FROM --platform=$TARGETPLATFORM node:${node_version} AS runner
RUN apk add --no-cache bind-tools
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

RUN npm i -g prisma

COPY --link --from=builder /app/apps/web/public ./public
COPY --link --from=builder /app/apps/web/next.config.js .
COPY --link --from=builder /app/apps/web/package.json .

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --link --from=builder --chown=1001:1001 /app/apps/web/.next/standalone ./
COPY --link --from=builder --chown=1001:1001 /app/apps/web/.next/static ./apps/web/.next/static
COPY --link --from=builder --chown=1001:1001 /app/apps/web/public ./apps/web/public
COPY --link --from=builder --chown=1001:1001 /app/apps/web/docker-entrypoint.sh ./

# workaround for https://github.com/wooorm/starry-night/issues/9
COPY --link --from=builder --chown=1001:1001 /app/node_modules/vscode-oniguruma/release/onig.wasm /app/node_modules/vscode-oniguruma/release/onig.wasm

RUN chmod +x ./docker-entrypoint.sh

USER nextjs

ENV HOSTNAME 0.0.0.0
ENV PORT 3000

EXPOSE 3000

ENTRYPOINT [ "./docker-entrypoint.sh" ]
CMD [ "node", "apps/web/server.js" ]
