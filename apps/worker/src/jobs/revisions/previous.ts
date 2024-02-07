import { db } from '../../db';
import { batch } from '../helper/batch';
import { isEmptyObject } from '@gw2treasures/helper/is';
import { toId } from '../helper/toId';
import { Job } from '../job';

export const RevisionsPrevious: Job = {
  run: async (itemIds: number[] | Record<string, never>) => {
    if(isEmptyObject(itemIds)) {
      const allItemIds = await db.item.findMany({ select: { id: true }});

      await db.job.deleteMany({ where: { type: 'revisions.previous', priority: 0 }});

      const jobs = await db.job.createMany({
        data: batch(allItemIds.map(toId), 2500).map((ids) => ({ type: 'revisions.previous', data: ids, priority: 0 }))
      });

      return `Created ${jobs.count} jobs`;
    }

    const items = await db.item.findMany({
      select: {
        id: true,
        history: {
          include: { revision: { select: { language: true, previousRevisionId: true }}},
          orderBy: { revision: { createdAt: 'desc' }}
        }
      },
      where: { id: { in: itemIds }}
    });

    for(const item of items) {
      console.log(item.id);

      await db.$transaction(async (tx) => {
        for(let i = 0; i < item.history.length; i++) {
          const history = item.history[i];

          const previousRevisionId = item.history.find(
            (prev, prevIndex) => prevIndex > i && prev.revision.language === history.revision.language
          )?.revisionId ?? null;

          // continue if we do not need to update
          if(history.revision.previousRevisionId === previousRevisionId) {
            continue;
          }

          if(history.revision.previousRevisionId !== null) {
            console.warn(`WARNING: Overriding previous revision of ${history.revisionId} from ${history.revision.previousRevisionId} to ${previousRevisionId}`);
          }

          // console.log(`Set previous of ${history.revisionId} to ${previousRevisionId ?? 'null'}`);
          await tx.revision.update({
            where: { id: history.revisionId },
            data: { previousRevisionId }
          });
        }
      });
    }
  }
};
