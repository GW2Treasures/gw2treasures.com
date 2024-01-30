import { PrismaClient } from '@gw2treasures/database';

export const db = new PrismaClient({
  log: ['info', { level: 'query', emit: 'event' }, 'error', 'warn']
});

export type PrismaTransaction = Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>;

export const dbDebug = { log: false };

db.$on('query', (event) => {
  if(!dbDebug.log) {
    return;
  }

  console.log('query', event.query, `(${event.duration} ms)`);
});
