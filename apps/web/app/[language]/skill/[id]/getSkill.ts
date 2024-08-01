import type { Language } from '@gw2treasures/database';
import { notFound } from 'next/navigation';
import { db } from '@/lib/prisma';
import { cache } from '@/lib/cache';
import type { Gw2Api } from 'gw2-api-types';

export const getSkill = cache(async (id: number, language: Language) => {
  const skill = await db.skill.findUnique({
    where: { id },
    include: {
      history: {
        include: { revision: { select: { id: true, buildId: true, createdAt: true, description: true, language: true }}},
        where: { revision: { language }},
        orderBy: { revision: { createdAt: 'desc' }}
      },
      icon: true,
    }
  });

  if(!skill) {
    notFound();
  }

  return skill;
}, ['skill'], { revalidate: 60 });

export const getRevision = cache(async (id: number, language: Language, revisionId?: string) => {
  const revision = revisionId
    ? await db.revision.findUnique({ where: { id: revisionId }})
    : await db.revision.findFirst({ where: { [`currentSkill_${language}`]: { id }}});

  return {
    revision,
    data: revision ? JSON.parse(revision.data) as Gw2Api.Skill : undefined,
  };
}, ['revision-skill'], { revalidate: 60 });
