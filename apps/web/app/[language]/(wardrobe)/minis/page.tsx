import { MiniTable } from '@/components/Mini/MiniTable';
import { cache } from '@/lib/cache';
import { linkPropertiesWithoutRarity } from '@/lib/linkProperties';
import type { PageProps } from '@/lib/next';
import { db } from '@/lib/prisma';
import { getTranslate } from '@/lib/translate';
import type { Metadata } from 'next';

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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { language } = await params;
  const t = getTranslate(language);

  return {
    title: t('minis'),
  };
}
