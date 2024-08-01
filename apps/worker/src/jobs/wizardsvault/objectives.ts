import { db } from '../../db';
import { fetchApi } from '../helper/fetchApi';
import { Job } from '../job';
import { isEmptyObject } from '@gw2treasures/helper/is';
import { type ProcessEntitiesData, createSubJobs, processLocalizedEntities } from '../helper/process-entities';
import { Prisma } from '@gw2treasures/database';
import { loadWizardsVaultObjectives } from '../helper/loadWizardsVaultObjectives';

export const WizardsVaultObjectivesJob: Job = {
  // eslint-disable-next-line require-await
  async run(data: ProcessEntitiesData<number> | Record<string, never>) {
    const CURRENT_VERSION = 1;

    if(isEmptyObject(data)) {
      return createSubJobs(
        'wizardsvault.objectives',
        () => fetchApi('/v2/wizardsvault/objectives'),
        db.wizardsVaultObjective.findMany,
        CURRENT_VERSION
      );
    }

    return processLocalizedEntities(
      data,
      'WizardsVaultObjective',
      (objectiveId, revisionId) => ({ wizardsVaultObjectiveId_revisionId: { revisionId, wizardsVaultObjectiveId: objectiveId }}),
      (objective) => {
        return {
          name_de: objective.de.title,
          name_en: objective.en.title,
          name_es: objective.es.title,
          name_fr: objective.fr.title,

          track: objective.en.track,
          acclaim: objective.en.acclaim,
        } satisfies Prisma.WizardsVaultObjectiveUncheckedUpdateInput;
      },
      db.wizardsVaultObjective.findMany,
      loadWizardsVaultObjectives,
      (tx, data) => tx.wizardsVaultObjective.create(data),
      (tx, data) => tx.wizardsVaultObjective.update(data),
      CURRENT_VERSION
    );
  }
};
