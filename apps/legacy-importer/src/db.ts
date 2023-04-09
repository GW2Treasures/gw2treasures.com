import { PrismaClient } from '@gw2treasures/database';
import { PrismaClient as LegacyPrismaClient } from '../.prisma/legacy';

export const db = new PrismaClient();
export const legacy = new LegacyPrismaClient();
