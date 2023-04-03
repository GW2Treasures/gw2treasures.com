import { db, legacy } from '../db';
import { Gw2Api } from 'gw2-api-types';

export async function processSkins(buildId: number) {
  const ids = await legacy.skin.findMany({ select: { id: true }}).then((skins) => skins.map(({ id }) => id));
  const knownIds = await db.skin.findMany({ select: { id: true }}).then((skins) => skins.map(({ id }) => id));

  const newIds = ids.filter((id) => !knownIds.includes(id));
  const failedIds = [];

  console.log(`Importing ${newIds.length} skins.`);

  const importJob = await db.job.create({ data: { type: 'import.skins', data: {}, flags: ['LONG_RUNNING'], state: 'Running', startedAt: new Date(), priority: 10 }});

  for(const id of newIds) {
    try {
      const skin = await legacy.skin.findUnique({ where: { id }});

      if(!skin) {
        continue;
      }

      const data = JSON.parse(fixupDetails(skin.data_en));

      const revision_de = await db.revision.create({ data: { data: fixupDetails(skin.data_de), entity: 'Skin', language: 'de', buildId, description: 'Imported - No earlier history available' }});
      const revision_en = await db.revision.create({ data: { data: fixupDetails(skin.data_en), entity: 'Skin', language: 'en', buildId, description: 'Imported - No earlier history available' }});
      const revision_es = await db.revision.create({ data: { data: fixupDetails(skin.data_es), entity: 'Skin', language: 'es', buildId, description: 'Imported - No earlier history available' }});
      const revision_fr = await db.revision.create({ data: { data: fixupDetails(skin.data_fr), entity: 'Skin', language: 'fr', buildId, description: 'Imported - No earlier history available' }});

      if(skin.file_id) {
        await db.icon.upsert({
          create: { id: skin.file_id, signature: skin.signature },
          update: {},
          where: { id: skin.file_id }
        });
      }

      await db.skin.create({
        data: {
          id: skin.id,
          name_de: skin.name_de,
          name_en: skin.name_en,
          name_es: skin.name_es,
          name_fr: skin.name_fr,
          removedFromApi: skin.removed_from_api,
          iconId: skin.file_id,
          rarity: data.rarity,
          type: data.type,
          subtype: data.details?.type,
          weight: data.details?.weight_class,
          currentId_de: revision_de.id,
          currentId_en: revision_en.id,
          currentId_es: revision_es.id,
          currentId_fr: revision_fr.id,
          lastCheckedAt: new Date(0),
          history: { createMany: { data: [{ revisionId: revision_de.id }, { revisionId: revision_en.id }, { revisionId: revision_es.id }, { revisionId: revision_fr.id }] }}
        }
      });
    } catch(e) {
      console.error(e);
      failedIds.push(id);
    }
  }

  if(failedIds.length > 0) {
    console.log('Failed to import the following skins:', failedIds);
  }

  await db.job.update({ where: { id: importJob.id }, data: { state: 'Success', output: `Imported ${newIds.length - failedIds.length} skins (${failedIds.length} failed)`, finishedAt: new Date() }});
}

function fixupDetails(json: string): string {
  const data = JSON.parse(json);

  if('details' in data) {
    return json;
  }

  const key = getOldDetailsKey(data);

  if(key in data) {
    data.details = data[key];
    delete data[key];
  }

  return JSON.stringify(data);
}

function getOldDetailsKey(data: Gw2Api.Skin): string {
  switch(data.type) {
    default: return data.type.toLowerCase();
  }
}
