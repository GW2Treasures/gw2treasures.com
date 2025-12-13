import { createPrismaClient } from '@gw2treasures/database/setup';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient as LegacyPrismaClient } from './generated/prisma';

export const db = createPrismaClient(process.env.DATABASE_URL!);

const adapter = new PrismaPg({ connectionString: process.env.LEGACY_DATABASE_URL! });
export const legacy = new LegacyPrismaClient({ adapter });
