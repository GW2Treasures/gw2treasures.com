import { notFound } from 'next/navigation';
import { db } from '@/lib/prisma';
import type { Language } from '@gw2treasures/database';
import { NextResponse } from 'next/server';
import { createTooltip } from '@/components/Achievement/AchievementTooltip';
import type { Gw2Api } from 'gw2-api-types';
import { cache } from '@/lib/cache';
import type { RouteHandler } from '@/lib/next';
import { getLanguage } from '@/lib/translate';

const getAchievementRevision = cache((id: number, language: Language, revisionId?: string) => {
  return revisionId
    ? db.revision.findFirst({ where: { id: revisionId, entity: 'Achievement' }})
    : db.revision.findFirst({ where: { [`currentAchievement_${language}`]: { id }}});
}, ['achievement-revision'], { revalidate: 60 });

export const GET: RouteHandler<{ id: string }> = async (request, { params }) => {
  const language = await getLanguage();
  const { id } = await params;
  const achievementId = Number(id);

  const { searchParams } = new URL(request.url);
  const revisionId = searchParams.get('revision') ?? undefined;

  const revision = await getAchievementRevision(achievementId, language, revisionId);

  if(!revision) {
    notFound();
  }

  const data: Gw2Api.Achievement = JSON.parse(revision.data);
  const tooltip = await createTooltip(data, language);

  return NextResponse.json(tooltip, {
    headers: { 'cache-control': 'public, max-age=3600', 'Vary': 'Origin' }
  });
};
