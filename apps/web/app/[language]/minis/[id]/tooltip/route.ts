import { notFound } from 'next/navigation';
import { db } from '@/lib/prisma';
import type { Language } from '@gw2treasures/database';
import { NextRequest, NextResponse } from 'next/server';
import { createTooltip } from '@/components/Mini/MiniTooltip';
import { cache } from '@/lib/cache';
import type { Mini } from '@gw2api/types/data/mini';

const getMiniRevision = cache((id: number, language: Language, revisionId?: string) => {
  return revisionId
    ? db.revision.findFirst({ where: { id: revisionId, entity: 'Mini' }})
    : db.revision.findFirst({ where: { [`currentMini_${language}`]: { id }}});
}, ['mini-revision'], { revalidate: 60 });

export async function GET(request: NextRequest, { params: { language, id }}: { params: { language: Language, id: string }}) {
  const miniId = Number(id);

  const { searchParams } = new URL(request.url);
  const revisionId = searchParams.get('revision') ?? undefined;

  const revision = await getMiniRevision(miniId, language, revisionId);

  if(!revision) {
    notFound();
  }

  const data: Mini = JSON.parse(revision.data);
  const tooltip = await createTooltip(data, language);

  return NextResponse.json(tooltip, {
    headers: { 'cache-control': 'public, max-age=3600', 'Vary': 'Origin' }
  });
}
