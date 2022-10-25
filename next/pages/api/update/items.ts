// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Prisma } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiItem } from '../../../lib/apiTypes';
import { db } from '../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('Updating...');

  const apiBuild = await getBuildFromApi();

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

async function getBuildFromApi() {
  const content = await fetch('http://assetcdn.101.arenanetworks.com/latest64/101').then((r) => r.text());

  return Number(content.split(' ')[0]);
}

async function processItems(buildId: number) {
  const ids: number[] = await fetch('https://api.guildwars2.com/v2/items').then((r) => r.json());

  // new items
  const knownIds = await db.item.findMany({ select: { id: true } }).then((items) => items.map(({ id }) => id));
  const knownRemovedIds = await db.item.findMany({ select: { id: true }, where: { removedFromApi: true } }).then((items) => items.map(({ id }) => id));

  const newIds = ids.filter((id) => !knownIds.includes(id));
  const removedIds = knownIds.filter((id) => !ids.includes(id));
  const rediscoveredIds = knownRemovedIds.filter((id) => ids.includes(id));

  console.log(`Updating items (${newIds.length} added, ${removedIds.length} removed, ${rediscoveredIds.length} rediscovered)`);

  await newItems(buildId, newIds);
  await removedItems(buildId, removedIds);
  await rediscoveredItems(buildId, rediscoveredIds);
}

async function newItems(buildId: number, newIds: number[]) {
  if(newIds.length === 0) {
    return;
  }

  const items_de: ApiItem[] = await fetch(`https://api.guildwars2.com/v2/items?lang=de&ids=${newIds.slice(0, 10).join(',')}`).then((r) => r.json());
  const items_en: ApiItem[] = await fetch(`https://api.guildwars2.com/v2/items?lang=en&ids=${newIds.slice(0, 10).join(',')}`).then((r) => r.json());
  const items_es: ApiItem[] = await fetch(`https://api.guildwars2.com/v2/items?lang=es&ids=${newIds.slice(0, 10).join(',')}`).then((r) => r.json());
  const items_fr: ApiItem[] = await fetch(`https://api.guildwars2.com/v2/items?lang=fr&ids=${newIds.slice(0, 10).join(',')}`).then((r) => r.json());

  const items = items_en.map((item) => ({
    en: item,
    de: items_de.find(({ id }) => id === item.id)!,
    es: items_es.find(({ id }) => id === item.id)!,
    fr: items_fr.find(({ id }) => id === item.id)!,
  }));

  const knownIcons = (await db.icon.findMany()).reduce<Record<number, string>>((knownIcons, { id, signature }) => ({ ...knownIcons, [id]: signature }), {});

  for(const { de, en, es, fr } of items) {
    const revision_de = await db.revision.create({ data: { data: JSON.stringify(de), language: 'de', buildId, description: 'Added to API' } });
    const revision_en = await db.revision.create({ data: { data: JSON.stringify(en), language: 'en', buildId, description: 'Added to API' } });
    const revision_es = await db.revision.create({ data: { data: JSON.stringify(es), language: 'es', buildId, description: 'Added to API' } });
    const revision_fr = await db.revision.create({ data: { data: JSON.stringify(fr), language: 'fr', buildId, description: 'Added to API' } });

    const icon = en.icon?.match(/\/(?<signature>[^\/]*)\/(?<id>[^\/]*)\.png$/)?.groups as { signature: string, id: number } | undefined;
    
    if(icon) {
      icon.id = Number(icon.id);
    }

    if(icon && !knownIcons[icon.id]) {
      await db.icon.create({ data: icon });
      knownIcons[icon.id] = icon.signature;
    } else if(icon && knownIcons[icon.id] !== icon.signature) {
      await db.icon.update({ where: { id: icon.id }, data: icon });
    }

    const i = await db.item.create({ data: {
      id: en.id,
      name_de: de.name,
      name_en: en.name,
      name_es: es.name,
      name_fr: fr.name,
      iconId: icon?.id,
      rarity: en.rarity,
      currentId_de: revision_de.id,
      currentId_en: revision_en.id,
      currentId_es: revision_es.id,
      currentId_fr: revision_fr.id,
      history: { createMany: { data: [{ revisionId: revision_de.id }, { revisionId: revision_en.id }, { revisionId: revision_es.id }, { revisionId: revision_fr.id }]} }
    }});
  }
}

async function removedItems(buildId: number, removedIds: number[]) {
  for(const removedId of removedIds) {
    const item = await db.item.findUnique({ where: { id: removedId }, include: { current_de: true, current_en: true, current_es: true, current_fr: true } });

    if(!item) {
      continue;
    }

    const update: Prisma.ItemUpdateArgs['data'] = {
      removedFromApi: true,
      history: { createMany: { data: [] }}
    };

    // create a new revision
    for(const language of ['de', 'en', 'es', 'fr'] as const) {
      const revision = await db.revision.create({
        data: {
          data: item[`current_${language}`].data,
          description: 'Removed from API',
          language,
          buildId,
        }
      });

      update[`currentId_${language}`] = revision.id;
      update.history!.createMany!.data = [...update.history!.createMany!.data as Prisma.ItemHistoryCreateManyItemInput[], { revisionId: revision.id }];
    }

    console.log(update);
    await db.item.update({ where: { id: removedId }, data: update });
  }
}

async function rediscoveredItems(buildId: number, rediscoveredIds: number[]) {
  if(rediscoveredIds.length === 0) {
    return;
  }

  const items_de: ApiItem[] = await fetch(`https://api.guildwars2.com/v2/items?lang=de&ids=${rediscoveredIds.slice(0, 200).join(',')}`).then((r) => r.json());
  const items_en: ApiItem[] = await fetch(`https://api.guildwars2.com/v2/items?lang=en&ids=${rediscoveredIds.slice(0, 200).join(',')}`).then((r) => r.json());
  const items_es: ApiItem[] = await fetch(`https://api.guildwars2.com/v2/items?lang=es&ids=${rediscoveredIds.slice(0, 200).join(',')}`).then((r) => r.json());
  const items_fr: ApiItem[] = await fetch(`https://api.guildwars2.com/v2/items?lang=fr&ids=${rediscoveredIds.slice(0, 200).join(',')}`).then((r) => r.json());

  const items = items_en.map((item) => ({
    en: item,
    de: items_de.find(({ id }) => id === item.id)!,
    es: items_es.find(({ id }) => id === item.id)!,
    fr: items_fr.find(({ id }) => id === item.id)!,
  }));

  for(const data of items) {
    const item = await db.item.findUnique({ where: { id: data.en.id } });

    if(!item) {
      continue;
    }

    const update: Prisma.ItemUpdateArgs['data'] = {
      removedFromApi: false,
      name_de: data.de.name,
      name_en: data.en.name,
      name_es: data.es.name,
      name_fr: data.fr.name,
      history: { createMany: { data: [] }}
    };

    // create a new revision
    for(const language of ['de', 'en', 'es', 'fr'] as const) {
      const revision = await db.revision.create({
        data: {
          data: JSON.stringify(data[language]),
          description: 'Rediscovered in API',
          language,
          buildId,
        }
      });

      update[`currentId_${language}`] = revision.id;
      update.history!.createMany!.data = [...update.history!.createMany!.data as Prisma.ItemHistoryCreateManyItemInput[], { revisionId: revision.id }];
    }

    console.log(update);
    await db.item.update({ where: { id: item.id }, data: update });
  }
}
