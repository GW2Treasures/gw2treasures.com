import { notFound } from 'next/navigation';
import { db } from '@/lib/prisma';
import { linkProperties } from '@/lib/linkProperties';
import { UnwrapJsonResponse, jsonResponse } from 'app/api/helper';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get('id'));

  if(isNaN(id) || id <= 0) {
    notFound();
  }

  const item = await db.item.findUnique({ where: { id }, select: linkProperties });

  if(!item) {
    notFound();
  }

  return jsonResponse(item);
}

export type ApiItemLinkResponse = UnwrapJsonResponse<ReturnType<typeof GET>>;
