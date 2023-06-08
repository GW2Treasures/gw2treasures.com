import { Job } from '../job';
import { db } from '../../db';
import { Prisma } from '@gw2treasures/database';
import { getCurrentBuild } from '../helper/getCurrentBuild';
import { loadCurrencies } from '../helper/loadCurrencies';
import { createIcon } from '../helper/createIcon';
import { appendHistory } from '../helper/appendHistory';
import { createMigrator } from './migrations';

export const CurrenciesRediscovered: Job = {
  run: async (rediscoveredIds: number[]) => {
    const build = await getCurrentBuild();
    const buildId = build.id;

    if(rediscoveredIds.length === 0) {
      return;
    }

    const currencies = await loadCurrencies(rediscoveredIds);
    const migrate = await createMigrator();

    for(const [id, data] of currencies) {
      const currency = await db.currency.findUnique({ where: { id }});

      if(!currency) {
        continue;
      }

      const iconId = await createIcon(data.en.icon);
      const migratedData = await migrate(data);

      const update: Prisma.CurrencyUpdateArgs['data'] = {
        removedFromApi: false,
        name_de: data.de.name,
        name_en: data.en.name,
        name_es: data.es.name,
        name_fr: data.fr.name,
        order: data.en.order,
        iconId,
        ...migratedData,
        lastCheckedAt: new Date(),
        history: { createMany: { data: [] }}
      };

      // create a new revision
      for(const language of ['de', 'en', 'es', 'fr'] as const) {
        const revision = await db.revision.create({
          data: {
            data: JSON.stringify(data[language]),
            description: 'Rediscovered in API',
            entity: 'Currency',
            language,
            buildId,
          }
        });

        update[`currentId_${language}`] = revision.id;
        update.history = appendHistory(update, revision.id);
      }

      await db.currency.update({ where: { id: currency.id }, data: update });
    }

    return `Rediscovered ${rediscoveredIds.length} currency`;
  }
};
