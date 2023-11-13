import { Gw2Api } from 'gw2-api-types';
import { fetchApi } from './fetchApi';
import { groupEntitiesById } from './groupById';

export async function loadTitles(ids: number[]) {
  const start = new Date();

  const [de, en, es, fr] = await Promise.all([
    fetchApi<Gw2Api.Title[]>(`/v2/titles?lang=de&ids=${ids.join(',')}`),
    fetchApi<Gw2Api.Title[]>(`/v2/titles?lang=en&ids=${ids.join(',')}`),
    fetchApi<Gw2Api.Title[]>(`/v2/titles?lang=es&ids=${ids.join(',')}`),
    fetchApi<Gw2Api.Title[]>(`/v2/titles?lang=fr&ids=${ids.join(',')}`),
  ]);

  console.log(`Fetched ${ids.length} titles in ${(new Date().valueOf() - start.valueOf()) / 1000}s`);

  return groupEntitiesById(de, en, es, fr);
}

