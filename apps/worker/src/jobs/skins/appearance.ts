import { Prisma } from '@gw2treasures/database';
import { db } from '../../db';
import { Job } from '../job';

interface WikiAskResponse {
  'query-continue-offset'?: number,
  query: {
    results: Record<string, {
      printouts: {
        'Has game id': Array<number>
        'Has appearance'?: { 0?: { fulltext: string }}
        'Has set appearance'?: { 0?: { fulltext: string }}
        'Has skin set'?: { 0?: { fulltext: string }}
      }
      fulltext: string
    }>,
  }
}

interface SkinsWikiProps {
  offset?: number
}

const batchSize = 1500;

export const SkinsWikiJob: Job = {
  run: async ({ offset = undefined }: SkinsWikiProps) => {
    if(offset === undefined) {
      // get the max skin id we know
      const skins = await db.skin.aggregate({ _max: { id: true }});

      // make sure we have some skins in the db
      if(!skins._max.id) {
        return 'No skins in db';
      }

      // we can't pass 1500 ids to the the wiki api, so we just create batches of the range of ids
      for(let i = 0; i < skins._max.id / batchSize; i++) {
        const scheduledAt = new Date();
        // space jobs by 2 minutes
        scheduledAt.setMinutes(scheduledAt.getMinutes() + 2 * i);

        await db.job.create({
          data: { type: 'skins.wiki', data: { offset: i * batchSize + 1 } satisfies SkinsWikiProps, scheduledAt },
        });
      }

      return 'Queued follow up jobs';
    }

    const query = `[[Has context::Skin]][[Has game id::>>${offset - 1}]][[Has game id::<<${offset + batchSize}]]|?Has game id|?Has appearance|?Has skin set.Has appearance=Has set appearance|?Has skin set|limit=${batchSize}`
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;');
    const url = `https://wiki.guildwars2.com/api.php?action=ask&query=${encodeURIComponent(query)}&format=json`;

    console.log('> Fetch data for skins from wiki');
    console.log(url);

    const headers = {
      'User-Agent': 'Mozilla/5.0 (compatible; gw2treasures.com/1.0; +https://gw2treasures.com/)'
    };

    const data = await fetch(url, { headers }).then((r) => {
      if(r.status !== 200) {
        throw new Error(`${url} returned ${r.status} ${r.statusText}`);
      }

      return r.json();
    }) as WikiAskResponse;

    const results = Object.values(data.query.results);
    console.log(`> Update data for ${results.length} skins`);

    const updates: Prisma.SkinUpdateManyArgs[] = [];

    // load sets from db and create name -> id map
    const sets = Object.fromEntries((await db.skinSet.findMany({ select: { id: true, name_en: true }})).map((set) => [set.name_en, set.id]));

    for(const result of results) {
      const ids = result.printouts['Has game id'];

      const image = result.printouts['Has appearance']?.[0]?.fulltext ?? result.printouts['Has set appearance']?.[0]?.fulltext;
      const isSkin = result.printouts['Has appearance']?.[0]?.fulltext === image;

      const setName = result.printouts['Has skin set']?.[0]?.fulltext;

      // if we don't have an image and no set name, skip
      if(!image || !setName) {
        continue;
      }

      // if we don't know the set, create it
      if(setName && !sets[setName]) {
        const newSet = await db.skinSet.create({ data: { name_en: setName }, select: { id: true }});
        sets[setName] = newSet.id;
      }

      // push the update to our queue
      updates.push({
        where: { id: { in: ids }},
        data: {
          wikiImage: image, wikiImageType: image ? (isSkin ? 'Skin' : 'Set') : undefined,
          setId: sets[setName]
        }
      });
    }

    // run all updates in a single transaction
    const updated = (
      await db.$transaction(
        updates.map((update) => db.skin.updateMany(update))
      )
    ).reduce((total, { count }) => count + total, 0);

    return `Updated wiki data for ${updated}/${results.length} skins (id ${offset}–${offset + batchSize - 1})`;
  }
};
