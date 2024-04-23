import { fetchApi } from './fetchApi';
import { WizardsVaultTrack } from '@gw2treasures/database';
import { groupLocalizedEntitiesById } from './groupById';

export async function loadWizardsVaultObjectives(ids: number[]) {
  const start = new Date();

  const [de, en, es, fr] = await Promise.all([
    fetchApi<WizardsVaultObjectiveData[]>(`/v2/wizardsvault/objectives?lang=de&ids=${ids.join(',')}`),
    fetchApi<WizardsVaultObjectiveData[]>(`/v2/wizardsvault/objectives?lang=en&ids=${ids.join(',')}`),
    fetchApi<WizardsVaultObjectiveData[]>(`/v2/wizardsvault/objectives?lang=es&ids=${ids.join(',')}`),
    fetchApi<WizardsVaultObjectiveData[]>(`/v2/wizardsvault/objectives?lang=fr&ids=${ids.join(',')}`),
  ]);

  console.log(`Fetched ${ids.length} guild upgrades in ${(new Date().valueOf() - start.valueOf()) / 1000}s`);

  return groupLocalizedEntitiesById(de, en, es, fr);
}

interface WizardsVaultObjectiveData {
  id: number,
  title: string,
  track: WizardsVaultTrack,
  acclaim: number,
}
