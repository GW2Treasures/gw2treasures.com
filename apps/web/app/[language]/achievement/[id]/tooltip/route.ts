import { notFound } from 'next/navigation';
import { db } from '@/lib/prisma';
import { Language } from '@gw2treasures/database';
import { NextRequest, NextResponse } from 'next/server';
import { createTooltip } from '@/components/Achievement/AchievementTooltip';
import { Gw2Api } from 'gw2-api-types';
import { remember } from '@/lib/remember';

export const dynamic = 'force-dynamic';

const getAchievementRevision = remember(60, function getAchievementRevision(id: number, language: Language, revisionId?: string) {
  return revisionId
    ? db.revision.findFirst({ where: { id: revisionId, entity: 'Achievement' }})
    : db.revision.findFirst({ where: { [`currentAchievement_${language}`]: { id }}});
});

export async function GET(request: NextRequest, { params: { language, id }}: { params: { language: Language, id: string }}) {
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
}
