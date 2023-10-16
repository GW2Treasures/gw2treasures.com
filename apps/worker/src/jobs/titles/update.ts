import { Job } from '../job';
import { db } from '../../db';
import { getCurrentBuild } from '../helper/getCurrentBuild';
import { loadTitles } from '../helper/loadTitles';
import { queueJobForIds } from '../helper/queueJobsForIds';
import { localeExists } from '../helper/types';
import { createMigrator } from './migrations';

export const TitlesUpdate: Job = {
  run: async (ids: number[] | Record<string, never>) => {
    const build = await getCurrentBuild();
    const buildId = build.id;

    if(!Array.isArray(ids)) {
      // skip if any follow up jobs are still queued
      const queuedJobs = await db.job.count({ where: { type: { in: ['titles.update'] }, state: { in: ['Queued', 'Running'] }, cron: null }});

      if(queuedJobs > 0) {
        return 'Waiting for pending follow up jobs';
      }

      // add 15 minutes to timestamp to make sure api cache is updated
      const checkDate = new Date(build.createdAt);
      checkDate.setMinutes(checkDate.getMinutes() + 15);

      const idsToUpdate = (await db.title.findMany({
        where: { lastCheckedAt: { lt: checkDate }, removedFromApi: false },
        orderBy: { lastCheckedAt: 'asc' },
        select: { id: true }
      })).map(({ id }) => id);

      await queueJobForIds('titles.update', idsToUpdate, 1);
      return `Queued update for ${idsToUpdate.length} titles (Build ${build.id})`;
    }

    const titlesToUpdate = await db.title.findMany({
      where: { id: { in: ids }},
      orderBy: { lastCheckedAt: 'asc' },
      include: { current_de: true, current_en: true, current_es: true, current_fr: true },
      take: 200,
    });

    if(titlesToUpdate.length === 0) {
      return 'No titles to update';
    }

    // load titles from API
    const apiTitles = await loadTitles(titlesToUpdate.map(({ id }) => id));

    const titles = titlesToUpdate.map((existing) => ({
      existing,
      ...apiTitles.get(existing.id)
    })).filter(localeExists);

    const migrate = await createMigrator();

    let updatedTitles = 0;

    for(const { existing, de, en, es, fr } of titles) {
      const changed_de = existing.current_de.data !== JSON.stringify(de);
      const changed_en = existing.current_en.data !== JSON.stringify(en);
      const changed_es = existing.current_es.data !== JSON.stringify(es);
      const changed_fr = existing.current_fr.data !== JSON.stringify(fr);

      if(!changed_de && !changed_en && !changed_es && !changed_fr) {
        // nothing changed
        await db.title.update({ data: { lastCheckedAt: new Date() }, where: { id: existing.id }});
        continue;
      }

      const revision_de = changed_de ? await db.revision.create({ data: { data: JSON.stringify(de), language: 'de', buildId, type: 'Update', entity: 'Title', description: 'Updated in API' }}) : existing.current_de;
      const revision_en = changed_en ? await db.revision.create({ data: { data: JSON.stringify(en), language: 'en', buildId, type: 'Update', entity: 'Title', description: 'Updated in API' }}) : existing.current_en;
      const revision_es = changed_es ? await db.revision.create({ data: { data: JSON.stringify(es), language: 'es', buildId, type: 'Update', entity: 'Title', description: 'Updated in API' }}) : existing.current_es;
      const revision_fr = changed_fr ? await db.revision.create({ data: { data: JSON.stringify(fr), language: 'fr', buildId, type: 'Update', entity: 'Title', description: 'Updated in API' }}) : existing.current_fr;

      const data = await migrate({ de, en, es, fr });

      await db.title.update({
        where: { id: existing.id },
        data: {
          name_de: de.name,
          name_en: en.name,
          name_es: es.name,
          name_fr: fr.name,

          ...data,

          currentId_de: revision_de.id,
          currentId_en: revision_en.id,
          currentId_es: revision_es.id,
          currentId_fr: revision_fr.id,
          lastCheckedAt: new Date(),
          history: { createMany: { data: [{ revisionId: revision_de.id }, { revisionId: revision_en.id }, { revisionId: revision_es.id }, { revisionId: revision_fr.id }], skipDuplicates: true }}
        }
      });

      updatedTitles++;
    }

    return `Updated ${updatedTitles}/${titles.length} titles`;
  }
};
