import { createPrismaClient } from '@gw2treasures/database/setup';

// https://pris.ly/d/help/next-js-best-practices

const prismaClientSingleton = () => {
  const datasourceUrl = new URL(process.env.DATABASE_URL!);
  datasourceUrl.searchParams.set('application_name', 'web');

  // if datasourceUrl does not have connection_limit, set it to 16 to handle more parallel connections
  if(!datasourceUrl.searchParams.has('connection_limit')) {
    datasourceUrl.searchParams.set('connection_limit', '16');
  }

  return createPrismaClient(datasourceUrl.toString(), {
    log: ['error', 'warn', 'info']
  });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  db: PrismaClientSingleton | undefined,
};

export const db = globalForPrisma.db ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalForPrisma.db = db;
