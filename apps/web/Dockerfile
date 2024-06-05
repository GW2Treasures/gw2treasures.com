# syntax=docker/dockerfile:1.7

ARG node_version=20.14.0-alpine
# renovate: datasource=npm packageName=prisma
ARG prisma_version=5.15.0
# renovate: datasource=npm packageName=sharp
ARG sharp_version=0.33.4

FROM --platform=$BUILDPLATFORM node:${node_version} AS source
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /source
COPY --link package*.json ./
RUN npm ci --workspaces=false
COPY --link . .
RUN npx turbo prune --scope=web --docker

# Install dependencies (on TARGETPLATFORM)
FROM --platform=$TARGETPLATFORM node:${node_version} AS dependencies
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy pruned package.json from source
COPY --link .gitignore .gitignore
COPY --link --from=source /source/out/json/ .
COPY --link --from=source /source/out/package-lock.json package-lock.json

RUN npm ci --include=dev --include=optional

# Build application on BUILDPLATFORM for speed
FROM --platform=$BUILDPLATFORM node:${node_version} AS builder
ARG TARGETPLATFORM
ARG sharp_version
RUN apk add --no-cache libc6-compat
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED 1
ENV CI true

RUN npm install --os=linux --libc=musl --cpu=x64 sharp@${sharp_version}

# copy dependencies and source
COPY --link --from=dependencies /app .
COPY --link --from=source /source/out/full/ .

RUN npm run build -- --filter=web...

# Production image, COPY --link all the files and run next
FROM --platform=$TARGETPLATFORM node:${node_version} AS runner
ARG prisma_version
RUN apk add --no-cache bind-tools
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# TODO: is this even needed?
RUN npm i -g prisma@${prisma_version}

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
