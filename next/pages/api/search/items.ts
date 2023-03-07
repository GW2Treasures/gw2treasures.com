// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { nameQuery, splitSearchTerms } from '.';
import { db } from '@/lib/prisma';
import { remember } from '@/lib/remember';

const searchItems = remember(60, function searchItems(terms: string[]) {
  const nameQueries = nameQuery(terms);

  return db.item.findMany({
    where: terms.length > 0 ? { OR: nameQueries } : undefined,
    take: 5,
    include: { icon: true }
  });
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
  const result = await searchItems(terms);

  res.status(200).json({ searchValue, result });
}
