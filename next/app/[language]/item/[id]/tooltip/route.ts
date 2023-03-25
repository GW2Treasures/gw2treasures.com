import { notFound } from 'next/navigation';
import { db } from '@/lib/prisma';
import { Language } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params: { language, id }}: { params: { language: Language, id: string }}) {
  const itemId = Number(id);

  const revision = await db.revision.findFirst({ where: { [`currentItem_${language}`]: { id: itemId }}});

  if(!revision) {
    notFound();
  }

  return new NextResponse(revision.data, { headers: { 'content-type': 'application/json' }});
}
