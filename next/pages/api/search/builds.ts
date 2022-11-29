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

  const terms = splitSearchTerms(searchValue).filter((term) => Number(term).toString() === term);

  if(terms.length === 0) {
    return res.status(200).json({ searchValue, result: [] });
  }

  const result = await db.build.findMany({
    where: searchValue ? { OR: terms.map((term) => ({ id: Number(term) })) } : undefined,
    take: 5,
  });

  res.status(200).json({ searchValue, result });
}
