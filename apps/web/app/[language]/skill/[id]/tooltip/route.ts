import { notFound } from 'next/navigation';
import { db } from '@/lib/prisma';
import type { Language } from '@gw2treasures/database';
import { NextResponse } from 'next/server';
import type { Gw2Api } from 'gw2-api-types';
import { createTooltip } from '@/components/Skill/SkillTooltip';
import { cache } from '@/lib/cache';
import type { RouteHandler } from '@/lib/next';

const getSkillRevision = cache((id: number, language: Language, revisionId?: string) => {
  return revisionId
    ? db.revision.findFirst({ where: { id: revisionId, entity: 'Skill' }})
    : db.revision.findFirst({ where: { [`currentSkill_${language}`]: { id }}});
}, ['revision-skill'], { revalidate: 60 });

export const GET: RouteHandler<{ id: string }> = async (request, { params }) => {
  const { language, id } = await params;
  const itemId = Number(id);

  const { searchParams } = new URL(request.url);
  const revisionId = searchParams.get('revision') ?? undefined;

  const revision = await getSkillRevision(itemId, language, revisionId);

  if(!revision) {
    notFound();
  }

  const data: Gw2Api.Skill = JSON.parse(revision.data);
  const tooltip = await createTooltip(data, language);

  return NextResponse.json(tooltip, {
    headers: { 'cache-control': 'public, max-age=3600', 'Vary': 'Origin' }
  });
};
