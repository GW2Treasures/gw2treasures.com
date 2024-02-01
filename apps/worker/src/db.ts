import { PrismaClient } from '@gw2treasures/database';

const datasourceUrl = new URL(process.env.DATABASE_URL!);
datasourceUrl.searchParams.set('application_name', 'worker');

export const db = new PrismaClient({
  log: ['info', { level: 'query', emit: 'event' }, 'error', 'warn'],
  datasourceUrl: datasourceUrl.toString()
});

export type PrismaTransaction = Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>;

export const dbDebug = { log: false };

db.$on('query', (event) => {
  if(!dbDebug.log) {
    return;
  }

  console.log('query', event.query, `(${event.duration} ms)`);
});
