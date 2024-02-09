import { db } from '@/lib/prisma';
import { publicApi, type CallbackParams } from '../../..';

const maxItemId = Math.pow(2, 31) - 1;

export const GET = publicApi(async ({ language, params: { id }}: CallbackParams<{ id: string }>) => {
  const itemId = Number(id);

  if(isNaN(itemId) || itemId <= 0 || itemId > maxItemId || itemId.toString() !== id) {
    return { error: 400, text: 'Invalid item id' };
  }

  const item = await db.item.findFirst({
    where: { id: itemId },
    select: {
      current_de: language === 'de' ? { select: { data: true }} : false,
      current_en: language === 'en' ? { select: { data: true }} : false,
      current_es: language === 'es' ? { select: { data: true }} : false,
      current_fr: language === 'fr' ? { select: { data: true }} : false,
    }
  });

  if(!item) {
    return { error: 404, text: 'Item not found' };
  }

  return { stringAsJson: item[`current_${language}`].data };
});
