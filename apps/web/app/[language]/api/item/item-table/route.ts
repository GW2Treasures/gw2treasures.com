import { loadItems, loadTotalItemCount, type ItemTableLoadOptions } from '@/components/ItemTable/ItemTable.actions';
import type { Signed } from '@/components/ItemTable/query';
import type { ItemTableQuery, QueryModel } from '@/components/ItemTable/types';
import { NextResponse, NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const body: {
    query: Signed<ItemTableQuery<QueryModel>>,
    options?: ItemTableLoadOptions<QueryModel>
  } = await request.json();

  if(request.nextUrl.searchParams.has('count')) {
    if(!body.query) {
      return new NextResponse(null, { status: 400 });
    }

    return NextResponse.json(await loadTotalItemCount(body.query));
  }

  if(!body.query || !body.options) {
    return new NextResponse(null, { status: 400 });
  }

  return NextResponse.json(await loadItems(body.query, body.options));
}
