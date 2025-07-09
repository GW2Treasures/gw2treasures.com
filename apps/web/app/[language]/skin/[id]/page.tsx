import type { Language } from '@gw2treasures/database';
import DetailLayout from '@/components/Layout/DetailLayout';
import { db } from '@/lib/prisma';
import rarityClasses from '@/components/Layout/RarityColor.module.css';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import type { Gw2Api } from 'gw2-api-types';
import { notFound } from 'next/navigation';
import { SkinInfobox } from '@/components/Skin/SkinInfobox';
import { linkProperties } from '@/lib/linkProperties';
import { TableOfContentAnchor } from '@gw2treasures/ui/components/TableOfContent/TableOfContent';
import { ExternalLink } from '@gw2treasures/ui/components/Link/ExternalLink';
import { localizedName } from '@/lib/localizedName';
import { ItemTable } from '@/components/ItemTable/ItemTable';
import { ItemTableContext } from '@/components/ItemTable/ItemTableContext';
import { ItemTableColumnsButton } from '@/components/ItemTable/ItemTableColumnsButton';
import { Json } from '@/components/Format/Json';
import { pageView } from '@/lib/pageView';
import { cache } from '@/lib/cache';
import { Wardrobe } from './wardrobe';
import { SkinTable } from '@/components/Skin/SkinTable';
import { SkinTooltip } from '@/components/Skin/SkinTooltip';
import { AchievementTable } from '@/components/Achievement/AchievementTable';
import type { PageProps } from '@/lib/next';
import { createMetadata } from '@/lib/metadata';

const getSkin = cache(async (id: number, language: Language) => {
  const [skin, revision] = await Promise.all([
    db.skin.findUnique({
      where: { id },
      include: {
        icon: true,
        achievementBits: { include: { icon: true, rewardsItem: { select: linkProperties }, rewardsTitle: { select: { id: true, name_de: true, name_en: true, name_es: true, name_fr: true }}}},
        set: { include: { skins: { where: { id: { not: id }}, include: { icon: true }}}}
      }
    }),
    db.revision.findFirst({ where: { [`currentSkin_${language}`]: { id }}}),
  ]);

  if(!skin || !revision) {
    notFound();
  }

  const similar = await db.skin.findMany({
    where: {
      OR: [{ name_en: skin.name_en }, { iconId: skin.iconId }],
      id: { not: skin.id },
      setId: skin.setId !== null ? { not: skin.setId } : undefined
    },
    include: { icon: true }
  });

  return { skin, revision, similar };
}, ['get-skin'], { revalidate: 60 });

type SkinPageProps = PageProps<{ id: string }>;

async function SkinPage ({ params }: SkinPageProps) {
  const { language, id } = await params;

  const skinId: number = Number(id);

  const { skin, revision, similar } = await getSkin(skinId, language);
  await pageView('skin', skinId);

  const data: Gw2Api.Skin = JSON.parse(revision.data);

  return (
    <DetailLayout
      title={data.name || localizedName(skin, language)}
      icon={skin.icon}
      className={rarityClasses[data.rarity]}
      breadcrumb={`Skin › ${skin.type}${skin.subtype ? ` › ${skin.subtype}` : ''}${skin.weight ? ` › ${skin.weight}` : ''}`}
      infobox={<SkinInfobox skin={skin} data={data} language={language}/>}
    >
      <TableOfContentAnchor id="tooltip">Tooltip</TableOfContentAnchor>
      <SkinTooltip skin={data} language={language} hideTitle/>

      <Wardrobe skinId={skin.id}/>

      {skin.achievementBits.length > 0 && (
        <AchievementTable language={language} achievements={skin.achievementBits}>
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

      <ItemTableContext id="unlocksSkin">
        <Headline id="items" actions={<ItemTableColumnsButton/>}>Unlocked by</Headline>
        <ItemTable query={{ where: { unlocksSkin: { some: { id: skinId }}}}} collapsed defaultColumns={['item', 'level', 'rarity', 'type', 'buyPrice', 'buyPriceTrend']}/>
      </ItemTableContext>

      {skin.wikiImage && (
        <>
          <Headline id="appearance">Appearance</Headline>
          <ExternalLink href={`https://wiki.guildwars2.com/wiki/${encodeURI(skin.wikiImage)}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://wiki.guildwars2.com/wiki/Special:FilePath/${encodeURI(skin.wikiImage)}`}
              alt="Appearance"
              style={{ maxWidth: 640, maxHeight: 400, borderRadius: 4 }}/>
            <br/>Source: Guild Wars 2 Wiki
          </ExternalLink>
        </>
      )}

      {skin.set && skin.set.skins.length > 0 && (
        <SkinTable headline="Set" headlineId="set" skins={skin.set.skins}/>
      )}

      {similar.length > 0 && (
        <SkinTable headline="Similar Skins" headlineId="similar" skins={similar}/>
      )}

      <Headline id="data">Data</Headline>
      <Json data={data}/>
    </DetailLayout>
  );
}

export default SkinPage;

export const generateMetadata = createMetadata<SkinPageProps>(async ({ params }) => {
  const { language, id } = await params;

  const skinId: number = Number(id);
  const { skin } = await getSkin(skinId, language);

  return {
    title: localizedName(skin, language),
  };
});
