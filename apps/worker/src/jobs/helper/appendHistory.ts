import { Prisma } from '@gw2treasures/database';

export function appendHistory<T extends { history?: { createMany?: { data: Prisma.Enumerable<{ revisionId: string }> }}}>(update: T, revisionId: string) {
  return {
    ...update.history,
    createMany: { ...update.history?.createMany, data: [...enumerableToArray(update.history?.createMany?.data), { revisionId }] }
  };
}

function enumerableToArray<T>(enumerable: Prisma.Enumerable<T> = []): T[] {
  return Array.isArray(enumerable) ? enumerable : [enumerable];
}
