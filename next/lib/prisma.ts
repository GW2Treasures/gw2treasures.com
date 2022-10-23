import { PrismaClient } from "../.prisma/legacy";

// https://pris.ly/d/help/next-js-best-practices

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var legacy: PrismaClient | undefined
}

export const legacy =
  global.legacy ||
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') global.legacy = legacy
