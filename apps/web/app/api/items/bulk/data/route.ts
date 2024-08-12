import { db } from '@/lib/prisma';
import { publicApi, type PublicApiResponse } from '../../..';
import { cache } from '@/lib/cache';
import type { Language } from '@gw2treasures/database';
import { isDefined } from '@gw2treasures/helper/is';

const maxItemId = Math.pow(2, 31) - 1;
const maxAge = 60 * 60;

const getData = cache(async (ids: number[], language: Language): Promise<PublicApiResponse> => {
  const items = await db.item.findMany({
    where: { id: { in: ids }},
    select: {
      current_de: language === 'de' ? { select: { data: true }} : false,
      current_en: language === 'en' ? { select: { data: true }} : false,
      current_es: language === 'es' ? { select: { data: true }} : false,
      current_fr: language === 'fr' ? { select: { data: true }} : false,
    }
  });

  return {
    stringAsJson: `[${items.map((item) => item[`current_${language}`].data).join(',')}]`,
    status: items.length === 0 ? 404 : items.length < ids.length ? 206 : 200
  };
}, ['api/items/bulk/data'], { revalidate: maxAge });

export const GET = publicApi(
  '/items/bulk/data',
  ({ language, searchParams: { ids }}) => {
    if(!ids) {
      return { error: 400, text: 'Missing `ids` query parameter' };
    }

    const itemIds = ids.split(',').map((id) => {
      const numericId = Number(id);
      return (isNaN(numericId) || numericId <= 0 || numericId > maxItemId || numericId.toString() !== id) ? undefined : numericId;
    }).filter(isDefined);

    return getData(itemIds, language);
  },
  { maxAge }
);
