import fetch from 'node-fetch';
import { db } from '../../db';
import { Job } from '../job';

interface WikiAskResponse {
  query: {
    results: Record<string, {
      printouts: {
        'Has appearance': Array<{ fulltext: string }>
        'Has game id': Array<number>
      }
      fulltext: string
    }>,
  }
}

export const SkinsAppearance: Job = {
  run: async () => {
    const query = '[[Has context::Skin]][[Has appearance::+]][[Has game id::+]]|?Has appearance|?Has game id|limit=10000';
    const url = `https://wiki.guildwars2.com/api.php?action=ask&query=${encodeURIComponent(query)}&format=json`;

    console.log('> Fetch images for skins from wiki');
    const data: WikiAskResponse = await fetch(url).then((r) => r.json());

    const results = Object.values(data.query.results);
    console.log(`> Update images for ${results.length} skins`);

    let updated = 0;

    for(const result of results) {
      const ids = result.printouts['Has game id'];
      const image = result.printouts['Has appearance'][0].fulltext;

      const u = await db.skin.updateMany({
        where: {
          id: { in: ids },
          OR: [{ wikiImage: { not: image }}, { wikiImage: null }]
        },
        data: { wikiImage: image }
      });

      updated += u.count;
    }

    return `Set image for ${updated} skins`;
  }
};
