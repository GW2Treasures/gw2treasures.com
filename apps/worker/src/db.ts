import { PrismaClient } from '@gw2treasures/database';

export const db = new PrismaClient();

export type PrismaTransaction = Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>;
