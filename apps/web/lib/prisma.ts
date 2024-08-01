import { PrismaClient } from '@gw2treasures/database';

// https://pris.ly/d/help/next-js-best-practices

const prismaClientSingleton = () => {
  const datasourceUrl = new URL(process.env.DATABASE_URL!);
  datasourceUrl.searchParams.set('application_name', 'web');

  // if datasourceUrl does not have connection_limit, set it to 8 to handle more parallel connections
  if(!datasourceUrl.searchParams.has('connection_limit')) {
    datasourceUrl.searchParams.set('connection_limit', '8');
  }

  return new PrismaClient({
    log: ['error', 'warn', 'info'],
    datasourceUrl: datasourceUrl.toString()
  });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  db: PrismaClientSingleton | undefined
};

export const db = globalForPrisma.db ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalForPrisma.db = db;
