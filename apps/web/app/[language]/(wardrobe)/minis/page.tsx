import { MiniTable } from '@/components/Mini/MiniTable';
import { cache } from '@/lib/cache';
import { linkPropertiesWithoutRarity } from '@/lib/linkProperties';
import { createMetadata } from '@/lib/metadata';
import { db } from '@/lib/prisma';
import { getLanguage, getTranslate } from '@/lib/translate';

const getMinis = cache(async () => {
  return await db.mini.findMany({
    select: {
      ...linkPropertiesWithoutRarity,
      unlocks: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 48,
  });
}, ['minis'], { revalidate: 60 * 60 });

export default async function MinisPage() {
  const minis = await getMinis();

  return (
    <MiniTable minis={minis} headline="Recently added" headlineId="recent"/>
  );
}

export const generateMetadata = createMetadata(async () => {
  const language = await getLanguage();
  const t = getTranslate(language);

  return {
    title: t('minis'),
  };
});
