import { Prisma, Revision } from '@gw2treasures/database';
import { db } from '../../db';
import { LocalizedObject } from './types';
import { schema } from './schema';

export async function createRevisions(data: LocalizedObject, revision: Omit<Prisma.RevisionUncheckedCreateInput, 'data' | 'language' | 'schema'>): Promise<LocalizedObject<Revision>> {
  const [de, en, es, fr] = await Promise.all([
    db.revision.create({ data: { schema, data: JSON.stringify(data.de), language: 'de', ...revision }}),
    db.revision.create({ data: { schema, data: JSON.stringify(data.en), language: 'en', ...revision }}),
    db.revision.create({ data: { schema, data: JSON.stringify(data.es), language: 'es', ...revision }}),
    db.revision.create({ data: { schema, data: JSON.stringify(data.fr), language: 'fr', ...revision }}),
  ]);

  return {
    de, en, es, fr
  };
}
