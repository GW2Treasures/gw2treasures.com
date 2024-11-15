import { cache } from '@/lib/cache';
import { db } from '@/lib/prisma';
import type { Achievement } from '@gw2api/types/data/achievement';
import type { Language } from '@gw2treasures/database';


export const getRevision = cache(async (id: number, language: Language, revisionId?: string) => {
  const revision = revisionId
    ? await db.revision.findUnique({ where: { id: revisionId }})
    : await db.revision.findFirst({ where: { [`currentAchievement_${language}`]: { id }}});

  return {
    revision,
    data: revision ? JSON.parse(revision.data) as Achievement : undefined,
  };
}, ['revision-achievement'], { revalidate: 60 });
