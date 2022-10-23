import { PrismaClient as LegacyPrismaClient } from "../.prisma/legacy";
import { PrismaClient } from "../.prisma/database";

// https://pris.ly/d/help/next-js-best-practices

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var legacy: LegacyPrismaClient | undefined
  var db: PrismaClient | undefined
}

export const legacy =
  global.legacy ||
  new LegacyPrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') global.legacy = legacy

export const db =
  global.db ||
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') global.db = db
