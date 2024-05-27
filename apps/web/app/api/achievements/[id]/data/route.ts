import { db } from '@/lib/prisma';
import { publicApi, type PublicApiResponse } from '../../..';
import { cache } from '@/lib/cache';
import type { Language } from '@gw2treasures/database';

const maxId = Math.pow(2, 31) - 1;
const maxAge = 60;

const getData = cache(async (id: number, language: Language): Promise<PublicApiResponse> => {
  const achievement = await db.achievement.findFirst({
    where: { id },
    select: {
      createdAt: true,
      current_de: language === 'de' ? { select: { data: true }} : false,
      current_en: language === 'en' ? { select: { data: true }} : false,
      current_es: language === 'es' ? { select: { data: true }} : false,
      current_fr: language === 'fr' ? { select: { data: true }} : false,
    }
  });

  if(!achievement) {
    return { error: 404, text: 'Item not found' };
  }

  return {
    stringAsJson: achievement[`current_${language}`].data,
    header: {
      'X-Created-At': achievement.createdAt.toISOString()
    }
  };
}, ['api/achievements/:id/data'], { revalidate: maxAge });

export const GET = publicApi<'id'>(
  '/achievements/:id/data',
  ({ language, params: { id }}) => {
    const achievementId = Number(id);

    // validate achievementId
    if(isNaN(achievementId) || achievementId <= 0 || achievementId > maxId || achievementId.toString() !== id) {
      return { error: 400, text: 'Invalid achievement id' };
    }

    return getData(achievementId, language);
  },
  { maxAge }
);
