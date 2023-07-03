'use server';

import { Achievement } from '@gw2treasures/database';
import { WithIcon } from '@/lib/with';
import { nameQuery, splitSearchTerms } from 'app/[language]/api/search/route';
import { db } from '@/lib/prisma';
import { isTruthy } from '@gw2treasures/ui';

// eslint-disable-next-line require-await
export async function searchAchievement(query: string): Promise<WithIcon<Achievement>[]> {

  const searchTerms = splitSearchTerms(query);
  const nameQueries = nameQuery(searchTerms);

  return db.achievement.findMany({
    where: {
      OR: [
        { id: { in: searchTerms.map((id) => parseInt(id)).filter(isTruthy) }},
        ...nameQueries,
      ]
    },
    include: { icon: true },
    take: 5
  });
}
