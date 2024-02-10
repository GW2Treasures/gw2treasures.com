import { Job } from '../job';
import { db } from '../../db';
import { getCurrentBuild } from '../helper/getCurrentBuild';
import { loadSkins } from '../helper/loadSkins';
import { queueJobForIds } from '../helper/queueJobsForIds';
import { createIcon } from '../helper/createIcon';
import { localeExists } from '../helper/types';
import { createMigrator } from './migrations';
import { schema } from '../helper/schema';

export const SkinsUpdate: Job = {
  run: async (ids: number[] | Record<string, never>) => {
    const build = await getCurrentBuild();
    const buildId = build.id;

    if(!Array.isArray(ids)) {
      // skip if any follow up jobs are still queued
      const queuedJobs = await db.job.count({ where: { type: { in: ['skins.update'] }, state: { in: ['Queued', 'Running'] }, cron: null }});

      if(queuedJobs > 0) {
        return 'Waiting for pending follow up jobs';
      }

      // add 15 minutes to timestamp to make sure api cache is updated
      const checkDate = new Date(build.createdAt);
      checkDate.setMinutes(checkDate.getMinutes() + 15);

      const idsToUpdate = (await db.skin.findMany({
        where: { lastCheckedAt: { lt: checkDate }, removedFromApi: false },
        orderBy: { lastCheckedAt: 'asc' },
        select: { id: true }
      })).map(({ id }) => id);

      await queueJobForIds('skins.update', idsToUpdate, 1);
      return `Queued update for ${idsToUpdate.length} skins (Build ${build.id})`;
    }

    const skinsToUpdate = await db.skin.findMany({
      where: { id: { in: ids }},
      orderBy: { lastCheckedAt: 'asc' },
      include: { current_de: true, current_en: true, current_es: true, current_fr: true },
      take: 200,
    });

    if(skinsToUpdate.length === 0) {
      return 'No skins to update';
    }

    // load skins from API
    const apiSkins = await loadSkins(skinsToUpdate.map(({ id }) => id));

    const skins = skinsToUpdate.map((existing) => ({
      existing,
      ...apiSkins.get(existing.id)
    })).filter(localeExists);

    const migrate = await createMigrator();

    for(const { existing, de, en, es, fr } of skins) {
      const revision_de = existing.current_de.data !== JSON.stringify(de) ? await db.revision.create({ data: { data: JSON.stringify(de), language: 'de', buildId, type: 'Update', entity: 'Skin', description: 'Updated in API', schema }}) : existing.current_de;
      const revision_en = existing.current_en.data !== JSON.stringify(en) ? await db.revision.create({ data: { data: JSON.stringify(en), language: 'en', buildId, type: 'Update', entity: 'Skin', description: 'Updated in API', schema }}) : existing.current_en;
      const revision_es = existing.current_es.data !== JSON.stringify(es) ? await db.revision.create({ data: { data: JSON.stringify(es), language: 'es', buildId, type: 'Update', entity: 'Skin', description: 'Updated in API', schema }}) : existing.current_es;
      const revision_fr = existing.current_fr.data !== JSON.stringify(fr) ? await db.revision.create({ data: { data: JSON.stringify(fr), language: 'fr', buildId, type: 'Update', entity: 'Skin', description: 'Updated in API', schema }}) : existing.current_fr;

      const iconId = await createIcon(en.icon);

      const data = migrate({ de, en, es, fr });

      await db.skin.update({
        where: { id: existing.id },
        data: {
          name_de: de.name,
          name_en: en.name,
          name_es: es.name,
          name_fr: fr.name,
          iconId,
          rarity: en.rarity,
          type: en.type,
          subtype: en.details?.type,
          weight: en.details?.weight_class,

          ...data,

          currentId_de: revision_de.id,
          currentId_en: revision_en.id,
          currentId_es: revision_es.id,
          currentId_fr: revision_fr.id,
          lastCheckedAt: new Date(),
          history: { createMany: { data: [{ revisionId: revision_de.id }, { revisionId: revision_en.id }, { revisionId: revision_es.id }, { revisionId: revision_fr.id }], skipDuplicates: true }}
        }
      });
    }

    return `Updated ${skins.length} skins`;
  }
};
