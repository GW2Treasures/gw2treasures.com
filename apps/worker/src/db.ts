import { PrismaClient } from '@gw2treasures/database';
import { createPrismaClient } from '@gw2treasures/database/setup';

const datasourceUrl = new URL(process.env.DATABASE_URL!);
datasourceUrl.searchParams.set('application_name', 'worker');

export const db = createPrismaClient(datasourceUrl.toString(), {
  log: ['info', { level: 'query', emit: 'event' }, 'error', 'warn']
});

export type PrismaTransaction = Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$extends'>;

export const dbDebug = { log: false };

db.$on('query', (event) => {
  if(!dbDebug.log) {
    return;
  }

  console.log('query', event.query, `(${event.duration} ms)`);
});
