import fetch from 'node-fetch';
import { db } from '../../db';
import { Job } from '../job';

interface WikiAskResponse {
  'query-continue-offset'?: number,
  query: {
    results: Record<string, {
      printouts: {
        'Has game id': Array<number>
        'Has appearance': { 0?: { fulltext: string }}
      }
      fulltext: string
    }>,
  }
}

export const SkinsAppearance: Job = {
  run: async ({ offset = 0, set }: { offset?: number, set?: boolean }) => {
    if(set === undefined) {
      await db.job.createMany({
        data: [
          { type: 'skins.appearance', data: { offset: 0, set: false }},
          { type: 'skins.appearance', data: { offset: 0, set: true }}
        ]
      });

      return 'Queued follow up jobs';
    }

    const query = set
      ? `[[Has context::Skin]][[Has game id::+]][[Has skin set.Has appearance::+]]|?Has game id|?Has skin set.Has appearance|limit=5000|offset=${offset}`
      : `[[Has context::Skin]][[Has game id::+]][[Has appearance::+]]|?Has game id|?Has appearance|limit=5000|offset=${offset}`;
    const url = `https://wiki.guildwars2.com/api.php?action=ask&query=${encodeURIComponent(query)}&format=json`;

    console.log('> Fetch images for skins from wiki');
    console.log(url);

    const data: WikiAskResponse = await fetch(url).then((r) => {
      if(r.status !== 200) {
        throw new Error(`${url} returned ${r.status} ${r.statusText}`);
      }

      return r.json();
    });

    if(data['query-continue-offset']) {
      if(data['query-continue-offset'] > offset) {
        await db.job.create({ data: { type: 'skins.appearance', data: { set, offset: data['query-continue-offset'] }}});
      } else {
        console.warn('> Reached max offset');
      }
    }

    const results = Object.values(data.query.results);
    console.log(`> Update images for ${results.length} skins`);

    let updated = 0;

    for(const result of results) {
      const ids = result.printouts['Has game id'];

      const image = result.printouts['Has appearance'][0]?.fulltext;

      if(!image) {
        continue;
      }

      const u = await db.skin.updateMany({
        where: {
          id: { in: ids },
          AND: [
            { OR: [{ wikiImage: { not: image }}, { wikiImage: null }] },
            { OR: set ? [{ wikiImageType: 'Set' }, { wikiImageType: null }] : [] }
          ]
          ,
        },
        data: { wikiImage: image, wikiImageType: set ? 'Set' : 'Skin' }
      });

      updated += u.count;
    }

    return `Set image for ${updated} skins`;
  }
};
