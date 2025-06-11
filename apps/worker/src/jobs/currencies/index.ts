import { db } from '../../db';
import { fetchApi } from '../helper/fetchApi';
import { Job } from '../job';
import { isEmptyObject } from '@gw2treasures/helper/is';
import { Changes, type ProcessEntitiesData, createSubJobs, processLocalizedEntities } from '../helper/process-entities';
import { createIcon } from '../helper/createIcon';
import { getNamesWithFallback } from '../helper/helper';
import { RecipeIngredientType } from '@gw2treasures/database';
import { loadLocalizedEntities } from '../helper/load-entities';

const CURRENT_VERSION = 0;

export const CurrenciesJob: Job = {
  run(data: ProcessEntitiesData<number> | Record<string, never>) {
    if(isEmptyObject(data)) {
      return createSubJobs(
        'currencies',
        () => fetchApi('/v2/currencies'),
        db.currency.findMany,
        CURRENT_VERSION
      );
    }

    return processLocalizedEntities(
      data,
      'Currency',
      (ids) => loadLocalizedEntities('/v2/currencies', ids),
      (currencyId, revisionId) => ({ currencyId_revisionId: { revisionId, currencyId }}),
      async (currency, version, changes) => {
        // get name and icon
        const names = getNamesWithFallback(currency);
        const iconId = await createIcon(currency.en.icon);

        // connect to ingredients using this currency
        const ingredient = changes === Changes.New
          ? { connect: (await db.recipeIngredient.findMany({ where: { type: 'Currency', ingredientId: currency.en.id }, select: { recipeId: true }})).map(({ recipeId }) => ({ recipeId_type_ingredientId: { recipeId, type: RecipeIngredientType.Currency, ingredientId: currency.en.id }})) }
          : undefined;

        return {
          ...names,

          order: currency.en.order,

          iconId,
          ingredient,
        };
      },
      db.currency.findMany,
      (tx, data) => tx.currency.create(data),
      (tx, data) => tx.currency.update(data),
      CURRENT_VERSION
    );
  }
};
