import { Gw2Api } from 'gw2-api-types';
import { fetchApi } from './fetchApi';
import { groupLocalizedEntitiesById } from './groupById';

export async function loadSkins(ids: number[]) {
  const start = new Date();

  const [de, en, es, fr] = await Promise.all([
    fetchApi<Gw2Api.Skin[]>(`/v2/skins?lang=de&ids=${ids.join(',')}`),
    fetchApi<Gw2Api.Skin[]>(`/v2/skins?lang=en&ids=${ids.join(',')}`),
    fetchApi<Gw2Api.Skin[]>(`/v2/skins?lang=es&ids=${ids.join(',')}`),
    fetchApi<Gw2Api.Skin[]>(`/v2/skins?lang=fr&ids=${ids.join(',')}`),
  ]);

  console.log(`Fetched ${ids.length} skins in ${(new Date().valueOf() - start.valueOf()) / 1000}s`);

  return groupLocalizedEntitiesById(de, en, es, fr);
}
