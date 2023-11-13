import { db } from '../../db';
import { Job } from '../job';

function getDate(timestamp: Date): string {
  const date = `${timestamp.getUTCFullYear()}-${timestamp.getUTCMonth() + 1}-${timestamp.getUTCDate()}T00:00:00.000Z`;

  return date;
}

export const PageViewAggregate: Job = {
  run: async () => {
    // only aggregate views that are older than 24 hours
    const before = new Date();
    before.setUTCHours(24, 0, 0, 0);
    before.setDate(before.getDate() - 2);

    // get views
    const views = await db.pageView.findMany({ where: { timestamp: { lt: before }}});

    // group views by date/page/pageId
    const map = new Map<string, { date: string, page: string, pageId: number | null, count: number }>();
    views.forEach(({ page, pageId, timestamp }) => {
      const date = getDate(timestamp);
      const key = `${date}:${page}:${pageId}`;

      // increment count in map
      map.set(key, { date, page, pageId, count: (map.get(key)?.count ?? 0) + 1 });
    });

    // delete old singe page views and store aggregated
    const [{ count }] = await db.$transaction([
      db.pageView.deleteMany({ where: { timestamp: { lt: before }}}),
      db.pageViewHistory.createMany({ data: Array.from(map.values()) })
    ]);

    return `Aggregated ${count} page views before ${before.toUTCString()}`;
  }
};
