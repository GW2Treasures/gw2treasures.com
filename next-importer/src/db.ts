import { PrismaClient } from '@prisma/client';
import { PrismaClient as LegacyPrismaClient } from '../.prisma/legacy';

export const db = new PrismaClient();
export const legacy = new LegacyPrismaClient();
