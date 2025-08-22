import { notFound } from 'next/navigation';
import { db } from '@/lib/prisma';
import type { Language } from '@gw2treasures/database';
import { NextResponse } from 'next/server';
import { createTooltip } from '@/components/Trait/TraitTooltip';
import { cache } from '@/lib/cache';
import type { RouteHandler } from '@/lib/next';
import type { Trait } from '@gw2api/types/data/trait';
import { getLanguage } from '@/lib/translate';

const getTraitRevision = cache((id: number, language: Language, revisionId?: string) => {
  return revisionId
    ? db.revision.findFirst({ where: { id: revisionId, entity: 'Trait' }})
    : db.revision.findFirst({ where: { [`currentTrait_${language}`]: { id }}});
}, ['revision-trait'], { revalidate: 60 });

export const GET: RouteHandler<{ id: string }> = async (request, { params }) => {
  const language = await getLanguage();
  const { id } = await params;
  const itemId = Number(id);

  const { searchParams } = new URL(request.url);
  const revisionId = searchParams.get('revision') ?? undefined;

  const revision = await getTraitRevision(itemId, language, revisionId);

  if(!revision) {
    notFound();
  }

  const data: Trait = JSON.parse(revision.data);
  const tooltip = await createTooltip(data, language);

  return NextResponse.json(tooltip, {
    headers: { 'cache-control': 'public, max-age=3600', 'Vary': 'Origin' }
  });
};
