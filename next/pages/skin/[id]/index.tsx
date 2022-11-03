import { GetStaticPaths, NextPage } from 'next';
import { useRouter } from 'next/router';
import { Icon as DbIcon, Item, Language, Revision, Skin } from '@prisma/client';
import DetailLayout from '../../../components/Layout/DetailLayout';
import { Skeleton } from '../../../components/Skeleton/Skeleton';
import { Api } from '../../../lib/apiTypes';
import { db } from '../../../lib/prisma';
import { getStaticSuperProps, withSuperProps } from '../../../lib/superprops';
import rarityClasses from '../../../components/Layout/RarityColor.module.css';
import { getIconUrl } from '../../../components/Item/ItemIcon';
import { Json } from '../../../components/Format/Json';
import { Headline } from '../../../components/Headline/Headline';
import { ItemList } from '../../../components/ItemList/ItemList';
import { ItemLink } from '../../../components/Item/ItemLink';
import { Rarity } from '../../../components/Item/Rarity';

export interface SkinPageProps {
  skin: Skin & {
    icon?: DbIcon | null,
    unlockedByItems: (Item & { icon?: DbIcon | null })[]
  };
  revision: Revision;
}

const SkinPage: NextPage<SkinPageProps> = ({ skin, revision }) => {
  const router = useRouter();

  if(!skin) {
    return <DetailLayout title={<Skeleton/>} breadcrumb={<Skeleton/>}><Skeleton/></DetailLayout>;
  }

  const data: Api.Skin = JSON.parse(revision.data);

  return (
    <DetailLayout title={data.name} icon={skin.icon && getIconUrl(skin.icon, 64) || undefined} className={rarityClasses[data.rarity]} breadcrumb={`Skin › ${skin.type}${skin.subtype ? ` › ${skin.subtype}` : ''}${skin.weight ? ` › ${skin.weight}` : ''}`}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div><Rarity rarity={data.rarity}/></div>
        <div>{data.details?.type}</div>
        <div>{data.details?.weight_class}</div>
      </div>

      <Headline id="items">Unlocked by</Headline>

      <ItemList>
        {skin.unlockedByItems.map((item) => <li key={item.id}><ItemLink item={item}/></li>)}
      </ItemList>

    </DetailLayout>
  );
};

export const getStaticProps = getStaticSuperProps<SkinPageProps>(async ({ params, locale }) => {
  const id: number = Number(params!.id!.toString())!;
  const language = (locale ?? 'en') as Language;

  const [skin, revision] = await Promise.all([
    db.skin.findUnique({
      where: { id },
      include: {
        icon: true,
        unlockedByItems: { include: { icon: true }}
      }
    }),
    db.revision.findFirst({ where: { [`currentSkin_${language}`]: { id }}})
  ]);

  if(!skin || !revision) {
    return {
      notFound: true
    };
  }

  return {
    props: { skin, revision },
    revalidate: 600 /* 10 minutes */
  };
});

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: true,
  };
};

export default withSuperProps(SkinPage);
