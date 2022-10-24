// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiItem } from '../../../lib/apiTypes';
import { db, legacy } from '../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('Importing...');

  const apiBuild = 0;

  // check if build is known
  const build = await db.build.findUnique({ where: { id: apiBuild }});

  if(build) {
    console.log(`Build ${build.id} already known since ${build.createdAt}.`);
  } else {
    console.log(`Creating new build ${apiBuild}`);
    await db.build.create({ data: { id: apiBuild } });
  }

  // update items
  await processItems(apiBuild);

  res.status(200).json({ status: 'OK' });
}

async function processItems(buildId: number) {
  const ids = await legacy.item.findMany({ select: { id: true } }).then((items) => items.map(({ id }) => id));
  const knownIds = await db.item.findMany({ select: { id: true } }).then((items) => items.map(({ id }) => id));

  const newIds = ids.filter((id) => !knownIds.includes(id));

  console.log(`Importing ${newIds.length} items.`);

  for(const id of newIds) {
    try {
      const item = await legacy.item.findUnique({ where: { id } });

      if(!item) {
        continue;
      }

      const revision_de = await db.revision.create({ data: { data: fixupDetails(item.data_de), language: 'de', buildId, description: 'Imported - No earlier history available' } });
      const revision_en = await db.revision.create({ data: { data: fixupDetails(item.data_en), language: 'en', buildId, description: 'Imported - No earlier history available' } });
      const revision_es = await db.revision.create({ data: { data: fixupDetails(item.data_es), language: 'es', buildId, description: 'Imported - No earlier history available' } });
      const revision_fr = await db.revision.create({ data: { data: fixupDetails(item.data_fr), language: 'fr', buildId, description: 'Imported - No earlier history available' } });
      
      await db.item.create({ data: {
        id: item.id,
        name_de: item.name_de,
        name_en: item.name_en,
        name_es: item.name_es,
        name_fr: item.name_fr,
        currentId_de: revision_de.id,
        currentId_en: revision_en.id,
        currentId_es: revision_es.id,
        currentId_fr: revision_fr.id,
        history: { createMany: { data: [{ revisionId: revision_de.id }, { revisionId: revision_en.id }, { revisionId: revision_es.id }, { revisionId: revision_fr.id }]} }
      }});
    } catch {}
  }
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

function getOldDetailsKey(data: ApiItem): string {
  switch(data.type) {
    case 'CraftingMaterial': return 'crafting_material';
    case 'MiniPet': return 'mini_pet';
    case 'UpgradeComponent': return 'upgrade_component';
    default: return data.type.toLowerCase();
  }
}
