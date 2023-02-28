import { Language } from '@prisma/client';
import DetailLayout from '@/components/Layout/DetailLayout';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { db } from '../../../lib/prisma';
import rarityClasses from '@/components/Layout/RarityColor.module.css';
import { getIconUrl } from '@/lib/getIconUrl';
import { Headline } from '@/components/Headline/Headline';
import { Rarity } from '@/components/Item/Rarity';
import { Gw2Api } from 'gw2-api-types';
import { ItemTable } from '@/components/Item/ItemTable';
import { notFound } from 'next/navigation';
import { ItemList } from '@/components/ItemList/ItemList';
import { SkinLink } from '@/components/Skin/SkinLink';

async function getSkin(id: number, language: Language) {
  const [skin, revision] = await Promise.all([
    db.skin.findUnique({
      where: { id },
      include: {
        icon: true,
        unlockedByItems: { include: { icon: true }}
      }
    }),
    db.revision.findFirst({ where: { [`currentSkin_${language}`]: { id }}}),
  ]);

  if(!skin || !revision) {
    notFound();
  }

  const similar = await db.skin.findMany({ where: { OR: [{ name_en: skin.name_en }, { iconId: skin.iconId }], id: { not: skin.id }}, include: { icon: true }});

  return { skin, revision, similar };
}

async function SkinPage ({ params }: { params: { id: string }}) {
  const locale = 'en'; // TODO
  const id: number = Number(params.id);
  const language = (locale ?? 'en') as Language;

  const { skin, revision, similar } = await getSkin(id, language);

  if(!skin) {
    return <DetailLayout title={<Skeleton/>} breadcrumb={<Skeleton/>}><Skeleton/></DetailLayout>;
  }

  const data: Gw2Api.Skin = JSON.parse(revision.data);

  return (
    <DetailLayout title={data.name} icon={skin.icon && getIconUrl(skin.icon, 64) || undefined} className={rarityClasses[data.rarity]} breadcrumb={`Skin › ${skin.type}${skin.subtype ? ` › ${skin.subtype}` : ''}${skin.weight ? ` › ${skin.weight}` : ''}`}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div><Rarity rarity={data.rarity}/></div>
        <div>{data.details?.type}</div>
        <div>{data.details?.weight_class}</div>
      </div>

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
