import { PrismaClient } from '@prisma/client';

export interface Job {
  run(db: PrismaClient, data: object | undefined): Promise<string | void> | string | void;
}
