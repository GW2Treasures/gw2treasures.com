import { db, legacy } from '../db';

export async function processAchievements(buildId: number) {
  const ids = await legacy.achievement.findMany({ select: { id: true }}).then((achievements) => achievements.map(({ id }) => id));
  const knownIds = await db.achievement.findMany({ select: { id: true }}).then((achievements) => achievements.map(({ id }) => id));

  const newIds = ids.filter((id) => !knownIds.includes(id));
  const failedIds = [];

  console.log(`Importing ${newIds.length} achievements.`);

  const importJob = await db.job.create({ data: { type: 'import.achievements', data: {}, flags: ['LONG_RUNNING'], state: 'Running', startedAt: new Date(), priority: 10 }});

  for(const id of newIds) {
    try {
      const achievement = await legacy.achievement.findUnique({ where: { id }});

      if(!achievement) {
        continue;
      }

      const revision_de = await db.revision.create({ data: { data: achievement.data_de, entity: 'Achievement', language: 'de', buildId, description: 'Imported - No earlier history available', schema: '' }});
      const revision_en = await db.revision.create({ data: { data: achievement.data_en, entity: 'Achievement', language: 'en', buildId, description: 'Imported - No earlier history available', schema: '' }});
      const revision_es = await db.revision.create({ data: { data: achievement.data_es, entity: 'Achievement', language: 'es', buildId, description: 'Imported - No earlier history available', schema: '' }});
      const revision_fr = await db.revision.create({ data: { data: achievement.data_fr, entity: 'Achievement', language: 'fr', buildId, description: 'Imported - No earlier history available', schema: '' }});

      if(achievement.file_id) {
        await db.icon.upsert({
          create: { id: achievement.file_id, signature: achievement.signature },
          update: {},
          where: { id: achievement.file_id }
        });
      }

      const prerequisiteFor = await db.achievement.findMany({ where: { prerequisitesIds: { has: id }}, select: { id: true }});

      await db.achievement.create({
        data: {
          id: achievement.id,
          name_de: achievement.name_de,
          name_en: achievement.name_en,
          name_es: achievement.name_es,
          name_fr: achievement.name_fr,
          removedFromApi: achievement.removed_from_api,
          iconId: achievement.file_id || null,
          currentId_de: revision_de.id,
          currentId_en: revision_en.id,
          currentId_es: revision_es.id,
          currentId_fr: revision_fr.id,
          lastCheckedAt: new Date(0),
          history: { createMany: { data: [{ revisionId: revision_de.id }, { revisionId: revision_en.id }, { revisionId: revision_es.id }, { revisionId: revision_fr.id }] }},
          prerequisiteFor: { connect: prerequisiteFor },
        }
      });
    } catch(e) {
      console.error(e);
      failedIds.push(id);
    }
  }

  if(failedIds.length > 0) {
    console.log('Failed to import the following achievements:', failedIds);
  }

  await db.job.update({ where: { id: importJob.id }, data: { state: 'Success', output: `Imported ${newIds.length - failedIds.length} achievements (${failedIds.length} failed)`, finishedAt: new Date() }});
}

