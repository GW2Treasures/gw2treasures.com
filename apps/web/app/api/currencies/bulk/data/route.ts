import { db } from '@/lib/prisma';
import { publicApi, type PublicApiResponse } from '../../..';
import { cache } from '@/lib/cache';
import type { Language } from '@gw2treasures/database';
import { isDefined } from '@gw2treasures/helper/is';

const maxId = Math.pow(2, 31) - 1;
const maxAge = 60 * 60;

const getData = cache(async (ids: number[] | 'all', language: Language): Promise<PublicApiResponse> => {
  const currencies = await db.currency.findMany({
    where: ids === 'all' ? { removedFromApi: false } : { id: { in: ids }},
    select: {
      current_de: language === 'de' ? { select: { data: true }} : false,
      current_en: language === 'en' ? { select: { data: true }} : false,
      current_es: language === 'es' ? { select: { data: true }} : false,
      current_fr: language === 'fr' ? { select: { data: true }} : false,
    }
  });

  return {
    stringAsJson: `[${currencies.map((currency) => currency[`current_${language}`].data).join(',')}]`,
    status: currencies.length === 0 ? 404 : (ids !== 'all' && currencies.length < ids.length) ? 206 : 200
  };
}, ['api/currencies/bulk/data'], { revalidate: maxAge });

export const GET = publicApi(
  '/currencies/bulk/data',
  ({ language, searchParams: { ids }}) => {
    if(!ids) {
      return { error: 400, text: 'Missing `ids` query parameter' };
    }

    if (ids === 'all') {
      return getData('all', language);
    }

    const rawIds = ids.split(',');

    if(rawIds.length > 1000) {
      return { error: 400, text: 'Only 1000 ids allowed' };
    }

    const currencyIds = rawIds.map((id) => {
      const numericId = Number(id);
      return (isNaN(numericId) || numericId <= 0 || numericId > maxId || numericId.toString() !== id) ? undefined : numericId;
    }).filter(isDefined);

    return getData(currencyIds, language);
  },
  { maxAge }
);
