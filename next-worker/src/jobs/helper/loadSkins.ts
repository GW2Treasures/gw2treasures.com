import { Gw2Api } from 'gw2-api-types';
import { fetchApi } from './fetchApi';
import { LocalizedObject } from './types';

function groupEntitiesById<T extends { id: string | number }>(entitiesDe: T[], entitiesEn: T[], entitiesEs: T[], entitiesFr: T[]): Map<T['id'], LocalizedObject<T>> {
  const map = new Map<T['id'], LocalizedObject<T>>();

  for(const en of entitiesEn) {
    const de = entitiesDe.find(({ id }) => id === en.id);
    const es = entitiesEs.find(({ id }) => id === en.id);
    const fr = entitiesFr.find(({ id }) => id === en.id);

    if(de !== undefined && es !== undefined && fr !== undefined) {
      map.set(en.id, { de, en, es, fr });
    }
  }

  return map;
}

export async function loadSkins(ids: number[]) {
  const start = new Date();

  const [de, en, es, fr] = await Promise.all([
    fetchApi<Gw2Api.Skin[]>(`/v2/skins?lang=de&v=latest&ids=${ids.join(',')}`),
    fetchApi<Gw2Api.Skin[]>(`/v2/skins?lang=en&v=latest&ids=${ids.join(',')}`),
    fetchApi<Gw2Api.Skin[]>(`/v2/skins?lang=es&v=latest&ids=${ids.join(',')}`),
    fetchApi<Gw2Api.Skin[]>(`/v2/skins?lang=fr&v=latest&ids=${ids.join(',')}`),
  ]);

  console.log(`Fetched ${ids.length} skins in ${(new Date().valueOf() - start.valueOf()) / 1000}s`);

  return groupEntitiesById(de, en, es, fr);
}
