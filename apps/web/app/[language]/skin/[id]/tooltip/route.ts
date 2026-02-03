import { notFound } from 'next/navigation';
import { db } from '@/lib/prisma';
import type { Language } from '@gw2treasures/database';
import { NextResponse } from 'next/server';
import { createTooltip } from '@/components/Skin/SkinTooltip';
import { cache } from '@/lib/cache';
import type { RouteHandler } from '@/lib/next';
import { getLanguage } from '@/lib/translate';
import type { Skin } from '@gw2api/types/data/skin';

const getSkinRevision = cache((id: number, language: Language, revisionId?: string) => {
  return revisionId
    ? db.revision.findFirst({ where: { id: revisionId, entity: 'Skin' }})
    : db.revision.findFirst({ where: { [`currentSkin_${language}`]: { id }}});
}, ['skin-revision'], { revalidate: 60 });

export const GET: RouteHandler<'/[language]/skin/[id]/tooltip'> = async (request, { params }) => {
  const language = await getLanguage();
  const { id } = await params;
  const skinId = Number(id);

  const { searchParams } = new URL(request.url);
  const revisionId = searchParams.get('revision') ?? undefined;

  const revision = await getSkinRevision(skinId, language, revisionId);

  if(!revision) {
    notFound();
  }

  const data: Skin = JSON.parse(revision.data);
  const tooltip = await createTooltip(data, language);

  return NextResponse.json(tooltip, {
    headers: { 'cache-control': 'public, max-age=3600', 'Vary': 'Origin' }
  });
};
