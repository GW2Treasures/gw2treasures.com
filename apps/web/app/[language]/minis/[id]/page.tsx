import type { Language } from '@gw2treasures/database';
import DetailLayout from '@/components/Layout/DetailLayout';
import { db } from '@/lib/prisma';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { notFound } from 'next/navigation';
import { MiniInfobox } from '@/components/Mini/MiniInfobox';
import { linkProperties } from '@/lib/linkProperties';
import { localizedName } from '@/lib/localizedName';
import { ItemTable } from '@/components/ItemTable/ItemTable';
import { ItemTableContext } from '@/components/ItemTable/ItemTableContext';
import { ItemTableColumnsButton } from '@/components/ItemTable/ItemTableColumnsButton';
import { Json } from '@/components/Format/Json';
import { pageView } from '@/lib/pageView';
import { cache } from '@/lib/cache';
import { MiniTooltip } from '@/components/Mini/MiniTooltip';
import { AchievementTable } from '@/components/Achievement/AchievementTable';
import type { Mini } from '@gw2api/types/data/mini';
import { Wardrobe } from './wardrobe';
import { createMetadata } from '@/lib/metadata';
import { getLanguage } from '@/lib/translate';

const getMini = cache(async (id: number, language: Language) => {
  const [mini, revision] = await Promise.all([
    db.mini.findUnique({
      where: { id },
      include: {
        icon: true,
        achievementBits: { include: { icon: true, rewardsItem: { select: linkProperties }, rewardsTitle: { select: { id: true, name_de: true, name_en: true, name_es: true, name_fr: true }}}},
      }
    }),
    db.revision.findFirst({ where: { [`currentMini_${language}`]: { id }}}),
  ]);

  if(!mini || !revision) {
    notFound();
  }

  return { mini, revision };
}, ['get-mini'], { revalidate: 60 });

type MiniPageProps = PageProps<'/[language]/minis/[id]'>;

async function MiniPage ({ params }: MiniPageProps) {
  const language = await getLanguage();
  const { id } = await params;
  const miniId: number = Number(id);

  const { mini, revision } = await getMini(miniId, language);
  await pageView('mini', miniId);

  const data: Mini = JSON.parse(revision.data);

  const name = data.name && data.name !== '((208738))'
    ? data.name
    : localizedName(mini, language);

  return (
    <DetailLayout
      title={name}
      icon={mini.icon}
      breadcrumb="Mini"
      infobox={<MiniInfobox mini={mini} language={language}/>}
    >
      <MiniTooltip mini={data} language={language} hideTitle/>

      <Wardrobe miniId={mini.id}/>

      {mini.achievementBits.length > 0 && (
        <AchievementTable language={language} achievements={mini.achievementBits}>
          {(table, columnSelect) => (
            <>
              <Headline id="achievements" actions={columnSelect}>Achievements</Headline>
              <p>Required to complete these achievements:</p>

              <div style={{ marginTop: 16 }}>
                {table}
              </div>
            </>
          )}
        </AchievementTable>
      )}

      <ItemTableContext id="unlocksMini">
        <Headline id="items" actions={<ItemTableColumnsButton/>}>Unlocked by</Headline>
        <ItemTable query={{ where: { unlocksMinis: { some: { id: miniId }}}}} collapsed defaultColumns={['item', 'rarity', 'buyPrice', 'buyPriceTrend']}/>
      </ItemTableContext>

      <Headline id="data">Data</Headline>
      <Json data={data}/>
    </DetailLayout>
  );
}

export default MiniPage;

export const generateMetadata = createMetadata<MiniPageProps>(async ({ params }) => {
  const language = await getLanguage();
  const { id } = await params;
  const miniId: number = Number(id);
  const { mini } = await getMini(miniId, language);

  return {
    title: localizedName(mini, language),
    url: `/minis/${id}`,
  };
});
