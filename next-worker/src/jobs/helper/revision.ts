import { Prisma, Revision } from '@prisma/client';
import { db } from '../../db';
import { LocalizedObject } from './types';

export async function createRevisions(data: LocalizedObject, revision: Omit<Prisma.RevisionUncheckedCreateInput, 'data' | 'language'>): Promise<LocalizedObject<Revision>> {
  const [de, en, es, fr] = await Promise.all([
    db.revision.create({ data: { data: JSON.stringify(data.de), language: 'de', ...revision }}),
    db.revision.create({ data: { data: JSON.stringify(data.en), language: 'en', ...revision }}),
    db.revision.create({ data: { data: JSON.stringify(data.es), language: 'es', ...revision }}),
    db.revision.create({ data: { data: JSON.stringify(data.fr), language: 'fr', ...revision }}),
  ]);

  return {
    de, en, es, fr
  };
}
