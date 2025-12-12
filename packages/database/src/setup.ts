import { PrismaPg } from '@prisma/adapter-pg';
import { type Prisma, PrismaClient } from './generated/prisma/client.js';
import type { LogOptions } from './generated/prisma/internal/class.js';

type PrismaOptions = Omit<Prisma.PrismaClientOptions, 'adapter' | 'accelerateUrl'>;

export function createPrismaClient<
  Options extends PrismaOptions = PrismaOptions,
  LogOpts extends LogOptions<Options & { adapter: PrismaPg }> = LogOptions<Options & { adapter: PrismaPg }>,
  OmitOpts extends Prisma.PrismaClientOptions['omit'] = Options extends { omit: infer U } ? U : Prisma.PrismaClientOptions['omit'],
>(connectionString: string, options?: Options) {
  const adapter = new PrismaPg({ connectionString });
  const client = new PrismaClient({ ...options, adapter });

  return client as unknown as PrismaClient<LogOpts, OmitOpts>;
}
