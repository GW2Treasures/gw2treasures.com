import { Job } from '../job';
import { db } from '../../db';
import { getCurrentBuild } from '../helper/getCurrentBuild';
import { loadCurrencies } from '../helper/loadCurrencies';
import { createIcon } from '../helper/createIcon';
import { createRevisions } from '../helper/revision';
import { createMigrator } from './migrations';

export const CurrenciesNew: Job = {
  run: async (newIds: number[]) => {
    const build = await getCurrentBuild();
    const buildId = build.id;

    // load currencies from API
    const currencies = await loadCurrencies(newIds);

    const migrate = await createMigrator();

    for(const [id, { de, en, es, fr }] of currencies) {
      const revisions = await createRevisions({ de, en, es, fr }, { buildId, type: 'Added', entity: 'Currency', description: 'Added to API' });
      const data = await migrate({ de, en, es, fr });

      const iconId = await createIcon(en.icon);

      // TODO: add ingredients

      await db.currency.create({
        data: {
          id,
          name_de: de.name,
          name_en: en.name,
          name_es: es.name,
          name_fr: fr.name,
          order: en.order,
          iconId,

          ...data,

          currentId_de: revisions.de.id,
          currentId_en: revisions.en.id,
          currentId_es: revisions.es.id,
          currentId_fr: revisions.fr.id,
          history: { createMany: { data: [{ revisionId: revisions.de.id }, { revisionId: revisions.en.id }, { revisionId: revisions.es.id }, { revisionId: revisions.fr.id }] }},
        }
      });
    }

    return `Added ${currencies.size} currencies`;
  }
};
