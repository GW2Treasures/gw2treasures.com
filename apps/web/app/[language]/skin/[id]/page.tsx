import { Language } from '@gw2treasures/database';
import DetailLayout from '@/components/Layout/DetailLayout';
import { db } from '@/lib/prisma';
import rarityClasses from '@/components/Layout/RarityColor.module.css';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { Rarity } from '@/components/Item/Rarity';
import { Gw2Api } from 'gw2-api-types';
import { notFound } from 'next/navigation';
import { ItemList } from '@/components/ItemList/ItemList';
import { SkinLink } from '@/components/Skin/SkinLink';
import { SkinInfobox } from '@/components/Skin/SkinInfobox';
import { remember } from '@/lib/remember';
import { linkPropertiesWithoutRarity } from '@/lib/linkProperties';
import { AchievementLink } from '@/components/Achievement/AchievementLink';
import { TableOfContentAnchor } from '@gw2treasures/ui/components/TableOfContent/TableOfContent';
import { ExternalLink } from '@gw2treasures/ui/components/Link/ExternalLink';
import { localizedName } from '@/lib/localizedName';
import { ItemTable } from '@/components/ItemTable/ItemTable';
import { ItemTableContext } from '@/components/ItemTable/ItemTableContext';
import { ItemTableColumnsButton } from '@/components/ItemTable/ItemTableColumnsButton';
import { format } from 'gw2-tooltip-html';
import styles from './page.module.css';
import { Metadata } from 'next';

const getSkin = remember(60, async function getSkin(id: number, language: Language) {
  const [skin, revision] = await Promise.all([
    db.skin.findUnique({
      where: { id },
      include: {
        icon: true,
        achievementBits: { select: linkPropertiesWithoutRarity },
      }
    }),
    db.revision.findFirst({ where: { [`currentSkin_${language}`]: { id }}}),
  ]);

  if(!skin || !revision) {
    notFound();
  }

  const similar = await db.skin.findMany({ where: { OR: [{ name_en: skin.name_en }, { iconId: skin.iconId }], id: { not: skin.id }}, include: { icon: true }});

  return { skin, revision, similar };
});

interface SkinPageProps {
  params: {
    language: Language;
    id: string;
  }
}

async function SkinPage ({ params: { language, id }}: SkinPageProps) {
  const skinId: number = Number(id);

  const { skin, revision, similar } = await getSkin(skinId, language);

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
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {data.description && (<p className={styles.description} dangerouslySetInnerHTML={{ __html: format(data.description) }}/>)}
        <div><Rarity rarity={data.rarity}/></div>
        <div>{data.details?.type}</div>
        <div>{data.details?.weight_class}</div>
      </div>

      {skin.achievementBits.length > 0 && (
        <>
          <Headline id="achievements">Achievements</Headline>
          <p>Required to complete the following achievements:</p>
          <ItemList>
            {skin.achievementBits.map((achievement) => <li key={achievement.id}><AchievementLink achievement={achievement}/></li>)}
          </ItemList>
        </>
      )}

      <ItemTableContext id="unlocksSkin">
        <Headline id="items" actions={<ItemTableColumnsButton/>}>Unlocked by</Headline>
        <ItemTable query={{ where: { unlocksSkin: { some: { id: skinId }}}}} collapsed/>
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
        <>
          <Headline id="similar">Similar Skins</Headline>
          <ItemList>
            {similar.map((skin) => (
              <li key={skin.id}>
                <SkinLink skin={skin}/>
                {skin.weight} {skin.subtype ?? skin.type}
              </li>
            ))}
          </ItemList>
        </>
      )}
    </DetailLayout>
  );
};

export default SkinPage;

export async function generateMetadata({ params: { language, id }}: SkinPageProps): Promise<Metadata> {
  const skinId: number = Number(id);
  const { skin } = await getSkin(skinId, language);

  return {
    title: localizedName(skin, language)
  };
};
