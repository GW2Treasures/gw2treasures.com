import { Job } from '../job';
import { db } from '../../db';

export const Gw2ApiRequestsCleanup: Job = {
  run: async () => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const deleted = await db.apiRequest.deleteMany({ where: { createdAt: { lt: sevenDaysAgo }}});

    return `Deleted ${deleted.count} API requests older than 7 days.`;
  }
};
