import { Gw2Api } from 'gw2-api-types';
import { fetchApi } from './fetchApi';
import { groupLocalizedEntitiesById } from './groupById';

export async function loadGuildUpgrades(ids: number[]) {
  const start = new Date();

  const [de, en, es, fr] = await Promise.all([
    fetchApi<Gw2Api.Guild.Upgrade[]>(`/v2/guild/upgrades?lang=de&ids=${ids.join(',')}`),
    fetchApi<Gw2Api.Guild.Upgrade[]>(`/v2/guild/upgrades?lang=en&ids=${ids.join(',')}`),
    fetchApi<Gw2Api.Guild.Upgrade[]>(`/v2/guild/upgrades?lang=es&ids=${ids.join(',')}`),
    fetchApi<Gw2Api.Guild.Upgrade[]>(`/v2/guild/upgrades?lang=fr&ids=${ids.join(',')}`),
  ]);

  console.log(`Fetched ${ids.length} guild upgrades in ${(new Date().valueOf() - start.valueOf()) / 1000}s`);

  return groupLocalizedEntitiesById(de, en, es, fr);
}

