import { Prisma } from '@gw2treasures/database';
import { PrismaTransaction, db } from '../../db';

export function createRevision(data: Prisma.RevisionUncheckedCreateInput, tx?: PrismaTransaction) {
  return (tx ?? db).revision.create({ data, select: { id: true }});
}
