import { fetchApi } from './fetchApi';
import { groupEntitiesById } from './groupById';

export async function loadWizardsVaultListings(ids: number[]) {
  const start = new Date();

  const data = await fetchApi(`/v2/wizardsvault/listings?ids=${ids.join(',')}`);

  console.log(`Fetched ${ids.length} wizardsvault listings in ${(new Date().valueOf() - start.valueOf()) / 1000}s`);

  return groupEntitiesById(data);
}
