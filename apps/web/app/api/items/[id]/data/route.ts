import { db } from '@/lib/prisma';
import { publicApi, type PublicApiResponse } from '../../..';
import { cache } from '@/lib/cache';
import type { Language } from '@gw2treasures/database';

const maxItemId = Math.pow(2, 31) - 1;
const maxAge = 60;

const getData = cache(async (id: number, language: Language): Promise<PublicApiResponse> => {
  const item = await db.item.findFirst({
    where: { id },
    select: {
      createdAt: true,
      current_de: language === 'de' ? { select: { data: true }} : false,
      current_en: language === 'en' ? { select: { data: true }} : false,
      current_es: language === 'es' ? { select: { data: true }} : false,
      current_fr: language === 'fr' ? { select: { data: true }} : false,
    }
  });

  if(!item) {
    return { error: 404, text: 'Item not found' };
  }

  return {
    stringAsJson: item[`current_${language}`].data,
    header: {
      'X-Created-At': item.createdAt.toISOString()
    }
  };
}, ['api/items/:id/data'], { revalidate: maxAge });

export const GET = publicApi<'id'>(
  '/items/:id/data',
  ({ language, params: { id }}) => {
    const itemId = Number(id);

    // validate itemId
    if(isNaN(itemId) || itemId <= 0 || itemId > maxItemId || itemId.toString() !== id) {
      return { error: 400, text: 'Invalid item id' };
    }

    return getData(itemId, language);
  },
  { maxAge }
);
