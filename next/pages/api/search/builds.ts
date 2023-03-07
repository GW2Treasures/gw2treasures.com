// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { nameQuery, splitSearchTerms } from '.';
import { db } from '@/lib/prisma';
import { remember } from '@/lib/remember';

const searchBuilds = remember(60, function searchBuilds(terms: string[]) {
  return db.build.findMany({
    where: { OR: terms.map((term) => ({ id: Number(term) })) },
    take: 5,
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

  const terms = splitSearchTerms(searchValue).filter((term) => Number(term).toString() === term);

  if(terms.length === 0) {
    return res.status(200).json({ searchValue, result: [] });
  }

  const result = await searchBuilds(terms);

  res.status(200).json({ searchValue, result });
}
