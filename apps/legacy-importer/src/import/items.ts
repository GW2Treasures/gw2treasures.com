import { db, legacy } from '../db';
import { Gw2Api } from 'gw2-api-types';

export async function processItems(buildId: number) {
  const ids = await legacy.item.findMany({ select: { id: true }}).then((items) => items.map(({ id }) => id));
  const knownIds = await db.item.findMany({ select: { id: true }}).then((items) => items.map(({ id }) => id));

  const newIds = ids.filter((id) => !knownIds.includes(id));
  const failedIds = [];

  console.log(`Importing ${newIds.length} items.`);

  const importJob = await db.job.create({ data: { type: 'import.items', data: {}, flags: ['LONG_RUNNING'], state: 'Running', startedAt: new Date(), priority: 10 }});

  for(const id of newIds) {
    try {
      const item = await legacy.item.findUnique({ where: { id }});

      if(!item) {
        continue;
      }

      const revision_de = await db.revision.create({ data: { data: fixupDetails(item.data_de), entity: 'Item', language: 'de', buildId, description: 'Imported - No earlier history available', schema: '' }});
      const revision_en = await db.revision.create({ data: { data: fixupDetails(item.data_en), entity: 'Item', language: 'en', buildId, description: 'Imported - No earlier history available', schema: '' }});
      const revision_es = await db.revision.create({ data: { data: fixupDetails(item.data_es), entity: 'Item', language: 'es', buildId, description: 'Imported - No earlier history available', schema: '' }});
      const revision_fr = await db.revision.create({ data: { data: fixupDetails(item.data_fr), entity: 'Item', language: 'fr', buildId, description: 'Imported - No earlier history available', schema: '' }});

      if(item.file_id) {
        await db.icon.upsert({
          create: { id: item.file_id, signature: item.signature },
          update: {},
          where: { id: item.file_id }
        });
      }

      await db.item.create({
        data: {
          id: item.id,
          name_de: item.name_de,
          name_en: item.name_en,
          name_es: item.name_es,
          name_fr: item.name_fr,
          removedFromApi: item.removed_from_api,
          iconId: item.file_id,
          rarity: item.rarity,
          currentId_de: revision_de.id,
          currentId_en: revision_en.id,
          currentId_es: revision_es.id,
          currentId_fr: revision_fr.id,
          lastCheckedAt: new Date(0),
          createdAt: item.date_added,
          history: { createMany: { data: [{ revisionId: revision_de.id }, { revisionId: revision_en.id }, { revisionId: revision_es.id }, { revisionId: revision_fr.id }] }}
        }
      });
    } catch(e) {
      console.error(e);
      failedIds.push(id);
    }
  }

  if(failedIds.length > 0) {
    console.log('Failed to import the following items:', failedIds);
  }

  await db.job.update({ where: { id: importJob.id }, data: { state: 'Success', output: `Imported ${newIds.length - failedIds.length} items (${failedIds.length} failed)`, finishedAt: new Date() }});
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

function getOldDetailsKey(data: Gw2Api.Item): string {
  switch(data.type) {
    case 'CraftingMaterial': return 'crafting_material';
    case 'MiniPet': return 'mini_pet';
    case 'UpgradeComponent': return 'upgrade_component';
    default: return data.type.toLowerCase();
  }
}
