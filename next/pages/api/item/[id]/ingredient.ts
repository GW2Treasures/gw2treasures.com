// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Prisma } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Ingredients } from '../../../../components/Recipe/Ingredients';
import { db } from '../../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = req.query.id;

  if(!id || Array.isArray(id)) {
    return res.status(500).json({});
  }

  const itemId = Number(id);

  const recipes = await db.recipe.findMany({
    where: { itemIngredients: { some: { itemId }}},
    include: {
      currentRevision: true,
      outputItem: { include: { icon: true }},
      itemIngredients: { include: { Item: { include: { icon: true }}}},
    }
  });

  return res.status(200).json(recipes);
}
