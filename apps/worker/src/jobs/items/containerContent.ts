import { ContentChance, Prisma } from '@gw2treasures/database';
import { db } from '../../db';
import { queueJobForIds } from '../helper/queueJobsForIds';
import { toId } from '../helper/toId';
import { Job } from '../job';
import { isTruthy } from '@gw2treasures/helper/is';

interface WikiAskResponse {
  query: {
    results: Record<string, {
      printouts: {
        'ContentId': [number]
        'Chance': [ContentChance],
        'Quantity': [string]
      }
    }>,
  }
}

export const ItemsContainerContent: Job = {
  run: async (ids: number[] | undefined) => {
    if(!Array.isArray(ids)) {
      const containerIds = await db.item.findMany({
        where: {
          OR: [{ type: 'Container' }, { type: 'Consumable', subtype: 'Immediate' }],
          contains: { none: {}},
          containsCurrency: { none: {}}
        },
        select: { id: true }
      });

      await queueJobForIds('items.containerContent', containerIds.map(toId));

      return `Queued jobs for ${containerIds.length} containers`;
    }

    const knownItemIds = (await db.item.findMany({ select: { id: true }})).map(toId);

    let inserts = 0;

    for(const id of ids) {
      const query = `[[Contained in.Has game id::${id}]][[Has context::Container item]][[Contained in.Has context::Item]][[Contains item.Has context::Item]][[Contains item.Is historical::False]]|?Contained in.Has game id=ContainerId|?Contains item.Has game id=ContentId|?Has contained item chance=Chance|?Has contained item quantity=Quantity`;
      const url = `https://wiki.guildwars2.com/api.php?action=ask&query=${encodeURIComponent(query)}&format=json`;

      const result = await fetch(url).then((r) => r.json()) as WikiAskResponse;

      const contents = Object.values(result.query.results).map<Prisma.ContentCreateManyInput>((entry) => ({
        containerItemId: id,
        contentItemId: entry.printouts.ContentId[0],
        chance: entry.printouts.Chance[0],
        quantity: parseInt(entry.printouts.Quantity[0])
      })).filter((content) => isTruthy(content.contentItemId) && isTruthy(content.quantity) && content.chance in ContentChance && knownItemIds.includes(content.contentItemId));

      const created = await db.content.createMany({
        data: contents,
        skipDuplicates: true,
      });

      inserts += created.count;
    }

    return `Inserted ${inserts} contents`;
  }
};
