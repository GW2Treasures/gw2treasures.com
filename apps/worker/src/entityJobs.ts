import { db } from './db';
import { JobName } from './jobs';
import { appendHistory } from './jobs/helper/appendHistory';
import { fetchApi } from './jobs/helper/fetchApi';
import { getCurrentBuild } from './jobs/helper/getCurrentBuild';
import { queueJobForIds } from './jobs/helper/queueJobsForIds';
import { mapAllToIds } from './jobs/helper/toId';
import { Job } from './jobs/job';
import { Revision } from '@gw2treasures/database';

// TODO: .migrate
// TODO: .new
// TODO: .rediscovered
// TODO: .update

type PrismaSelect = { id: true };
type PrismaInclude = { current_de: true, current_en: true, current_es: true, current_fr: true };
type PrismaFindMany<Id extends string | number> = (args: { select: PrismaSelect, where?: { removedFromApi: true }}) => Promise<{ id: Id }[]>;
type PrismaFindUnique<Id extends string | number> = (args: { include: PrismaInclude, where: { id: Id }}) => Promise<{ id: Id, current_de: Revision, current_en: Revision, current_es: Revision, current_fr: Revision } | null>;
type PrismaUpdate<Id extends string | number> = (args: { where: { id: Id }, data: PrismaEntityUpdate }) => Promise<unknown>;
type PrismaEntityUpdate = Partial<{
  removedFromApi: true,
  history: { createMany: { data: { revisionId: string }[] }}
  currentId_de: string,
  currentId_en: string,
  currentId_es: string,
  currentId_fr: string,
}>

type PrismaEntity<Id extends string | number> = {
  findMany: PrismaFindMany<Id>
  findUnique: PrismaFindUnique<Id>
  update: PrismaUpdate<Id>
}

export function createEntityJobs<JobPrefix extends string, Id extends string | number>(
  jobPrefix: JobPrefix,
  entityName: string,
  endpoint: `/v2/${string}`,
  dbEntity: PrismaEntity<Id>
): Record<string, Job> {
  const jobNames = {
    check: `${jobPrefix}.check` as JobName,
    migrate: `${jobPrefix}.migrate` as JobName,
    new: `${jobPrefix}.new` as JobName,
    rediscovered: `${jobPrefix}.rediscovered` as JobName,
    removed: `${jobPrefix}.removed` as JobName,
    update: `${jobPrefix}.update` as JobName,
    import: `${jobPrefix}.import` as JobName,
  };

  return {
    [jobNames.check]: {
      async run() {
        // skip if any follow up jobs are still queued
        const queuedJobs = await db.job.count({ where: { type: { in: [jobNames.new, jobNames.removed, jobNames.rediscovered] }, state: { in: ['Queued', 'Running'] }}});

        if(queuedJobs > 0) {
          return 'Waiting for pending follow up jobs';
        }

        // get ids from the API
        const ids = await fetchApi<Id[]>(endpoint);

        // get known ids from the DB
        const knownIds = await dbEntity.findMany({ select: { id: true }}).then(mapAllToIds);
        const knownRemovedIds = await dbEntity.findMany({ select: { id: true }, where: { removedFromApi: true }}).then(mapAllToIds);

        // Build new ids
        const newIds = ids.filter((id) => !knownIds.includes(id));
        const removedIds = knownIds.filter((id) => !ids.includes(id) && !knownRemovedIds.includes(id));
        const rediscoveredIds = knownRemovedIds.filter((id) => ids.includes(id));

        // queue follow up jobs
        await queueJobForIds(jobNames.new, newIds);
        await queueJobForIds(jobNames.removed, removedIds);
        await queueJobForIds(jobNames.rediscovered, rediscoveredIds);

        return `${newIds.length} added, ${removedIds.length} removed, ${rediscoveredIds.length} rediscovered`;
      }
    },

    [jobNames.removed]: {
      async run (removedIds: Id[]) {
        const build = await getCurrentBuild();
        const buildId = build.id;

        for(const removedId of removedIds) {
          const entity = await dbEntity.findUnique({ where: { id: removedId }, include: { current_de: true, current_en: true, current_es: true, current_fr: true }});

          if(!entity) {
            continue;
          }

          const update: PrismaEntityUpdate = {
            removedFromApi: true,
            history: { createMany: { data: [] }}
          };

          // create a new revision
          for(const language of ['de', 'en', 'es', 'fr'] as const) {
            const revision = await db.revision.create({
              data: {
                data: entity[`current_${language}`].data,
                description: 'Removed from API',
                type: 'Removed',
                entity: entityName, // TODO
                language,
                buildId,
              }
            });

            update[`currentId_${language}`] = revision.id;
            update.history = appendHistory(update, revision.id);
          }

          await dbEntity.update({ where: { id: removedId }, data: update });
        }

        return `Marked ${removedIds.length} entities as removed`;
      }
    }
  };
}
