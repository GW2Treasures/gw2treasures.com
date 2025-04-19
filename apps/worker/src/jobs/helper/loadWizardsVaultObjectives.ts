import { fetchApi } from './fetchApi';
import { groupLocalizedEntitiesById } from './groupById';

// The Wizard's Vault API often returns wrong localized content
// So we always include a known objective in queries, and compare
// the returned objective names with known ones. This will break
// when the objective is renamed, but is better than wrong locales.
const referenceObjective = {
  id: 133,
  name: {
    de: 'Einloggen',
    en: 'Log In',
    es: 'Iniciar sesión',
    fr: 'Se connecter'
  }
};

export async function loadWizardsVaultObjectives(ids: number[]) {
  const start = new Date();

  // always include the login objective
  const idsWithReference = [...ids, referenceObjective.id];

  const [de, en, es, fr] = await Promise.all([
    fetchApi(`/v2/wizardsvault/objectives?ids=${shuffle(idsWithReference).join(',')}`, { language: 'de' }),
    fetchApi(`/v2/wizardsvault/objectives?ids=${shuffle(idsWithReference).join(',')}`, { language: 'en' }),
    fetchApi(`/v2/wizardsvault/objectives?ids=${shuffle(idsWithReference).join(',')}`, { language: 'es' }),
    fetchApi(`/v2/wizardsvault/objectives?ids=${shuffle(idsWithReference).join(',')}`, { language: 'fr' }),
  ]);

  console.log(`Fetched ${ids.length} wizard's vault objectives in ${(new Date().valueOf() - start.valueOf()) / 1000}s`);

  const groupedEntities = groupLocalizedEntitiesById(de, en, es, fr);

  const reference = groupedEntities.get(referenceObjective.id);
  if(
    !reference ||
    reference.de.title !== referenceObjective.name.de ||
    reference.en.title !== referenceObjective.name.en ||
    reference.es.title !== referenceObjective.name.es ||
    reference.fr.title !== referenceObjective.name.fr
  ) {
    throw new Error('Wrong language returned for Wizard\'s Vault objectives');
  }

  return groupedEntities;
}

function shuffle<T>(array: T[]): T[] {
  return array.map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}
