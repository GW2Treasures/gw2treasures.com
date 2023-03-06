import { Language } from '@prisma/client';
import { notFound } from 'next/navigation';
import { db } from '@/lib/prisma';

export async function getSkill(id: number, language: Language, revisionId?: string) {
  const [skill, revision] = await Promise.all([
    db.skill.findUnique({
      where: { id },
      include: {
        history: {
          include: { revision: { select: { id: true, buildId: true, createdAt: true, description: true, language: true }}},
          where: { revision: { language }},
          orderBy: { revision: { createdAt: 'desc' }}
        },
        icon: true,
      }
    }),
    revisionId
      ? db.revision.findUnique({ where: { id: revisionId }})
      : db.revision.findFirst({ where: { [`currentSkill_${language}`]: { id }}})
  ]);

  if(!skill || !revision) {
    notFound();
  }

  return { skill, revision };
}
