// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const searchValue = req.query.q?.toString();

  console.log(searchValue);

  const result = await db.item.findMany({ where: { name_en: { contains: searchValue, mode: 'insensitive' }}, take: 5, include: { icon: true }});

  res.status(200).json({ searchValue, result });
}
