// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { nameQuery, splitSearchTerms } from '.';
import { db } from '../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const searchValue = req.query.q?.toString();

  if(searchValue === undefined) {
    return res.status(500).json({ result: [] });
  }

  const terms = splitSearchTerms(searchValue);
  const nameQueries = nameQuery(terms);

  const result = await db.skin.findMany({
    where: searchValue ? { OR: nameQueries } : undefined,
    take: 5,
    include: { icon: true }
  });

  res.status(200).json({ searchValue, result });
}
