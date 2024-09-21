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
import type { Metadata } from 'next';
import { Json } from '@/components/Format/Json';
import { pageView } from '@/lib/pageView';
import { cache } from '@/lib/cache';
import { getAlternateUrls } from '@/lib/url';
import { Wardrobe } from './wardrobe';
import { SkinTable } from '@/components/Skin/SkinTable';
import { SkinTooltip } from '@/components/Skin/SkinTooltip';
import { AchievementTable } from '@/components/Achievement/AchievementTable';
import type { PageProps } from '@/lib/next';

const getSkin = cache(async (id: number, language: Language) => {
  const [skin, revision] = await Promise.all([
    db.skin.findUnique({
      where: { id },
      include: {
        icon: true,
        achievementBits: { include: { icon: true, rewardsItem: { select: linkProperties }, rewardsTitle: { select: { id: true, name_de: true, name_en: true, name_es: true, name_fr: true }}}},
      }
    }),
    db.revision.findFirst({ where: { [`currentSkin_${language}`]: { id }}}),
  ]);

  if(!skin || !revision) {
    notFound();
  }

  const similar = await db.skin.findMany({ where: { OR: [{ name_en: skin.name_en }, { iconId: skin.iconId }], id: { not: skin.id }}, include: { icon: true }});

  return { skin, revision, similar };
}, ['get-skin'], { revalidate: 60 });

type SkinPageProps = PageProps<{ id: string }>;

async function SkinPage ({ params: { language, id }}: SkinPageProps) {
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
        <ItemTable query={{ where: { unlocksSkin: { some: { id: skinId }}}}} collapsed defaultColumns={['item', 'level', 'rarity', 'type', 'vendorValue', 'sellPrice']}/>
      </ItemTableContext>

      {skin.wikiImage && (
        <>
          <Headline id="appearance">Appearance</Headline>
          <ExternalLink href={`https://wiki.guildwars2.com/wiki/${encodeURI(skin.wikiImage)}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://wiki.guildwars2.com/wiki/Special:FilePath/${encodeURI(skin.wikiImage)}?width=640`}
              srcSet={`https://wiki.guildwars2.com/wiki/Special:FilePath/${encodeURI(skin.wikiImage)}?width=1280 2x`}
              alt="Appearance"
              style={{ maxWidth: 640, maxHeight: 400, borderRadius: 4 }}/>
            <br/>Source: Guild Wars 2 Wiki
          </ExternalLink>
        </>
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

export async function generateMetadata({ params: { language, id }}: SkinPageProps): Promise<Metadata> {
  const skinId: number = Number(id);
  const { skin } = await getSkin(skinId, language);

  return {
    title: localizedName(skin, language),
    alternates: getAlternateUrls(`/skin/${id}`)
  };
}
