import { notFound } from 'next/navigation';
import { db } from '@/lib/prisma';
import type { Language } from '@gw2treasures/database';
import { NextResponse } from 'next/server';
import { createTooltip } from '@/components/Currency/CurrencyTooltip';
import type { Gw2Api } from 'gw2-api-types';
import { cache } from '@/lib/cache';
import type { RouteHandler } from '@/lib/next';

const getCurrencyRevision = cache(function (id: number, language: Language, revisionId?: string) {
  return revisionId
    ? db.revision.findFirst({ where: { id: revisionId, entity: 'Currency' }})
    : db.revision.findFirst({ where: { [`currentCurrency_${language}`]: { id }}});
}, ['currency-tooltip'], { revalidate: 60 });

export const GET: RouteHandler<{ id: string }> = async (request, { params }) => {
  const { language, id } = await params;
  const currencyId = Number(id);

  const { searchParams } = new URL(request.url);
  const revisionId = searchParams.get('revision') ?? undefined;

  const revision = await getCurrencyRevision(currencyId, language, revisionId);

  if(!revision) {
    notFound();
  }

  const data: Gw2Api.Currency = JSON.parse(revision.data);
  const tooltip = await createTooltip(data, language);

  return NextResponse.json(tooltip, {
    headers: { 'cache-control': 'public, max-age=3600', 'Vary': 'Origin' }
  });
};
