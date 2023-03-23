import { Language } from '@prisma/client';
import DetailLayout from '@/components/Layout/DetailLayout';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { db } from '@/lib/prisma';
import rarityClasses from '@/components/Layout/RarityColor.module.css';
import { getIconUrl } from '@/lib/getIconUrl';
import { Headline } from '@/components/Headline/Headline';
import { Rarity } from '@/components/Item/Rarity';
import { Gw2Api } from 'gw2-api-types';
import { ItemTable } from '@/components/Item/ItemTable';
import { notFound } from 'next/navigation';
import { ItemList } from '@/components/ItemList/ItemList';
import { SkinLink } from '@/components/Skin/SkinLink';
import { SkinInfobox } from '@/components/Skin/SkinInfobox';
import { remember } from '@/lib/remember';
import { linkPropertiesWithoutRarity } from '@/lib/linkProperties';
import { AchievementLink } from '@/components/Achievement/AchievementLink';
import { TableOfContentAnchor } from '@/components/TableOfContent/TableOfContent';

const getSkin = remember(60, async function getSkin(id: number, language: Language) {
  const [skin, revision] = await Promise.all([
    db.skin.findUnique({
      where: { id },
      include: {
        icon: true,
        unlockedByItems: { include: { icon: true }},
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

async function SkinPage ({ params: { language, id }}: { params: { language: Language, id: string }}) {
  const skinId: number = Number(id);

  const { skin, revision, similar } = await getSkin(skinId, language);

  if(!skin) {
    return <DetailLayout title={<Skeleton/>} breadcrumb={<Skeleton/>}><Skeleton/></DetailLayout>;
  }

  const data: Gw2Api.Skin = JSON.parse(revision.data);

  return (
    <DetailLayout
      title={data.name}
      icon={skin.icon && getIconUrl(skin.icon, 64) || undefined}
      className={rarityClasses[data.rarity]}
      breadcrumb={`Skin › ${skin.type}${skin.subtype ? ` › ${skin.subtype}` : ''}${skin.weight ? ` › ${skin.weight}` : ''}`}
      infobox={<SkinInfobox skin={skin} data={data} language={language}/>}
    >
      <TableOfContentAnchor id="tooltip">Tooltip</TableOfContentAnchor>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
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

      <Headline id="items">Unlocked by</Headline>
      <ItemTable items={skin.unlockedByItems}/>

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
