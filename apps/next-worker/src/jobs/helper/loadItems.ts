import { Gw2Api } from 'gw2-api-types';
import { fetchApi } from './fetchApi';
import { groupEntitiesById } from './groupById';

export async function loadItems(ids: number[]) {
  const start = new Date();

  const [de, en, es, fr] = await Promise.all([
    fetchApi<Gw2Api.Item[]>(`/v2/items?lang=de&v=latest&ids=${ids.join(',')}`),
    fetchApi<Gw2Api.Item[]>(`/v2/items?lang=en&v=latest&ids=${ids.join(',')}`),
    fetchApi<Gw2Api.Item[]>(`/v2/items?lang=es&v=latest&ids=${ids.join(',')}`),
    fetchApi<Gw2Api.Item[]>(`/v2/items?lang=fr&v=latest&ids=${ids.join(',')}`),
  ]);

  console.log(`Fetched ${ids.length} items in ${(new Date().valueOf() - start.valueOf()) / 1000}s`);

  return groupEntitiesById(de, en, es, fr);
}
