import { db } from '../../db';
import { Job } from '../job';
import { createRevisionHash } from '../helper/revision';

export const RevisionsHash: Job = {
  run: async () => {
    // get revisions without hash
    const revisions = await db.revision.findMany({
      where: { hash: '' },
      select: { id: true, data: true },
      take: 2000,
    });

    // all revisions updated, skip
    if(revisions.length === 0) {
      return;
    }

    // update hash in db
    await db.$transaction(revisions.map(
      ({ id, data }) => db.revision.update({
        where: { id },
        data: { hash: createRevisionHash(data) }
      })
    ));

    // queue follow up job in 10s
    const scheduledAt = new Date();
    scheduledAt.setSeconds(scheduledAt.getSeconds() + 10);
    await db.job.create({ data: { type: 'revisions.hash', data: {}, priority: 0, scheduledAt }});

    return `Updated ${revisions.length} revisions`;
  }
};
