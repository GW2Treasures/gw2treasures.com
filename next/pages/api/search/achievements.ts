// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { nameQuery, splitSearchTerms } from '.';
import { db } from '@/lib/prisma';
import { remember } from '@/lib/remember';

const searchAchievements = remember(60, async function searchAchievements(terms: string[]) {
  const nameQueries = nameQuery(terms);

  const [achievements, achievementCategories, achievementGroups] = await Promise.all([
    db.achievement.findMany({
      where: terms.length > 0 ? { OR: nameQueries } : undefined,
      take: 5,
      include: { icon: true, achievementCategory: true }
    }),
    db.achievementCategory.findMany({
      where: terms.length > 0 ? { OR: nameQueries } : undefined,
      take: 5,
      include: { icon: true, achievementGroup: true }
    }),
    db.achievementGroup.findMany({
      where: terms.length > 0 ? { OR: nameQueries } : undefined,
      take: 5,
    }),
  ]);

  return { achievements, achievementCategories, achievementGroups };
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const searchValue = req.query.q?.toString();

  if(searchValue === undefined) {
    return res.status(500).json({ result: [] });
  }

  const terms = splitSearchTerms(searchValue);
  const result = await searchAchievements(terms);

  res.status(200).json({ searchValue, ...result });
}
