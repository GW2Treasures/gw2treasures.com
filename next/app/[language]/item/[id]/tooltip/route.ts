import { notFound } from 'next/navigation';
import { db } from '@/lib/prisma';
import { Language } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { createTooltip } from '@/components/Item/ItemTooltip';
import { Gw2Api } from 'gw2-api-types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params: { language, id }}: { params: { language: Language, id: string }}) {
  const itemId = Number(id);

  const revision = await db.revision.findFirst({ where: { [`currentItem_${language}`]: { id: itemId }}});

  if(!revision) {
    notFound();
  }

  const data: Gw2Api.Item = JSON.parse(revision.data);
  const tooltip = await createTooltip(data, language);

  return NextResponse.json(tooltip);
}
