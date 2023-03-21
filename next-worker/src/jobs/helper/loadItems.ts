import { Language } from '@prisma/client';
import { Gw2Api } from 'gw2-api-types';
import { fetchApi } from './fetchApi';

export async function loadItems(ids: number[]): Promise<{ [key in Language]: Gw2Api.Item }[]> {
  const start = new Date();

  const [de, en, es, fr] = await Promise.all([
    fetchApi<Gw2Api.Item[]>(`/v2/items?lang=de&v=latest&ids=${ids.join(',')}`),
    fetchApi<Gw2Api.Item[]>(`/v2/items?lang=en&v=latest&ids=${ids.join(',')}`),
    fetchApi<Gw2Api.Item[]>(`/v2/items?lang=es&v=latest&ids=${ids.join(',')}`),
    fetchApi<Gw2Api.Item[]>(`/v2/items?lang=fr&v=latest&ids=${ids.join(',')}`),
  ]);

  console.log(`Fetched ${ids.length} items in ${(new Date().valueOf() - start.valueOf()) / 1000}s`);

  const items = en.map((item) => ({
    en: item,
    de: de.find(({ id }) => id === item.id)!,
    es: es.find(({ id }) => id === item.id)!,
    fr: fr.find(({ id }) => id === item.id)!,
  }));

  return items;
}
