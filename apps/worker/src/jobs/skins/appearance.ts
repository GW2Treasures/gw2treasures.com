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
      }
      fulltext: string
    }>,
  }
}

interface SkinsAppearanceProps {
  offset?: number
}

const batchSize = 2500;

export const SkinsAppearance: Job = {
  run: async ({ offset = undefined }: SkinsAppearanceProps) => {
    if(offset === undefined) {
      const skins = await db.skin.aggregate({ _max: { id: true }});

      for(let i = 1; i < (skins._max.id ?? 0); i += batchSize) {
        await db.job.create({
          data: { type: 'skins.appearance', data: { offset: i } satisfies SkinsAppearanceProps },
        });
      }

      return 'Queued follow up jobs';
    }

    const query = `[[Has context::Skin]][[Has game id::≥${offset}]][[Has game id::<<${offset + batchSize}]]|?Has game id|?Has appearance|?Has skin set.Has appearance=Has set appearance|limit=${batchSize}`;
    const url = `https://wiki.guildwars2.com/api.php?action=ask&query=${encodeURIComponent(query)}&format=json`;

    console.log('> Fetch images for skins from wiki');
    console.log(url);

    const data = await fetch(url).then((r) => {
      if(r.status !== 200) {
        throw new Error(`${url} returned ${r.status} ${r.statusText}`);
      }

      return r.json();
    }) as WikiAskResponse;

    const results = Object.values(data.query.results);
    console.log(`> Update images for ${results.length} skins`);

    const updates: Prisma.SkinUpdateManyArgs[] = [];

    for(const result of results) {
      const ids = result.printouts['Has game id'];

      const image = result.printouts['Has appearance']?.[0]?.fulltext ?? result.printouts['Has set appearance']?.[0]?.fulltext;
      const isSkin = result.printouts['Has appearance']?.[0]?.fulltext === image;

      if(!image) {
        continue;
      }

      updates.push({
        where: { id: { in: ids }},
        data: { wikiImage: image, wikiImageType: isSkin ? 'Skin' : 'Set' }
      });
    }

    const updated = (
      await db.$transaction(
        updates.map((update) => db.skin.updateMany(update))
      )
    ).reduce((total, { count }) => count + total, 0);

    return `Updated image for ${updated}/${results.length} skins (id ${offset}–${offset + batchSize - 1})`;
  }
};
