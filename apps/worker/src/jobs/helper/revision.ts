import { Prisma, Revision } from '@gw2treasures/database';
import { db } from '../../db';
import { LocalizedObject } from './types';
import { schema } from './schema';
import { createHash } from 'crypto';

export async function createRevisions(data: LocalizedObject, revision: Omit<Prisma.RevisionUncheckedCreateInput, 'data' | 'hash' | 'language' | 'schema'>): Promise<LocalizedObject<Revision>> {
  const data_de = JSON.stringify(data.de);
  const data_en = JSON.stringify(data.en);
  const data_es = JSON.stringify(data.es);
  const data_fr = JSON.stringify(data.fr);

  const [de, en, es, fr] = await Promise.all([
    db.revision.create({ data: { schema, data: data_de, hash: createRevisionHash(data_de), language: 'de', ...revision }}),
    db.revision.create({ data: { schema, data: data_en, hash: createRevisionHash(data_en), language: 'en', ...revision }}),
    db.revision.create({ data: { schema, data: data_es, hash: createRevisionHash(data_es), language: 'es', ...revision }}),
    db.revision.create({ data: { schema, data: data_fr, hash: createRevisionHash(data_fr), language: 'fr', ...revision }}),
  ]);

  return {
    de, en, es, fr
  };
}

export function createRevisionHash(data: string) {
  return createHash('sha256').update(data).digest('base64');
}
