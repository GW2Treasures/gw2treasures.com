import { db } from '../../db';
import { Job } from '../job';
import { createRevisionHash } from '../helper/revision';

export const RevisionsHash: Job = {
  run: async () => {
    console.log('  Loading revisions without hash');

    // get revisions without hash
    const revisions = await db.revision.findMany({
      where: { hash: '' },
      select: { id: true, data: true },
      take: 1000,

      // prisma sorts by `id` by default, which is bad because postgres then uses an Index Scan using `Revision_pkey` to find revisions
      // sorting by the hash (even though the hash is always empty), prevents postgres to use an unrelated slow index.
      orderBy: { hash: 'asc' },
    });

    console.log(`  Found ${revisions.length} revisions`);

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
