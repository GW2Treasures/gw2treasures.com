// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Prisma } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
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

  const linkProperties: Prisma.ItemSelect = { id: true, icon: true, name_de: true, name_en: true, name_es: true, name_fr: true, rarity: true };

  const recipes = await db.recipe.findMany({
    where: { itemIngredients: { some: { itemId }}},
    select: {
      id: true,
      rating: true,
      disciplines: true,
      currentRevision: { select: { data: true }},
      outputItem: { select: linkProperties },
      itemIngredients: { select: { count: true, Item: { select: linkProperties }}},
    }
  });

  return res.status(200).json(recipes);
}
