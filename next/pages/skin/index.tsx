import { Prisma, Skin } from '@prisma/client';
import { NextPage } from 'next';
import { db } from '../../lib/prisma';
import { FormatDate } from '../../components/Format/FormatDate';
import { Headline } from '../../components/Headline/Headline';
import { ItemList } from '../../components/ItemList/ItemList';
import { SkinLink } from '../../components/Skin/SkinLink';
import { getServerSideSuperProps, withSuperProps } from '../../lib/superprops';
import { ItemIcon } from '../../components/Item/ItemIcon';
import Link from 'next/link';
import { FormatNumber } from '../../components/Format/FormatNumber';

interface SkinPageProps {
  newSkins: Skin[];
  byTypes: (Prisma.PickArray<Prisma.SkinGroupByOutputType, ('type' | 'subtype')[]> & {
    _count: number;
    _max: {
      iconId: number | null;
    };
  })[],
  iconMap: Record<number, string>
}

const SkinPage: NextPage<SkinPageProps> = ({ newSkins, byTypes, iconMap }) => {
  return (
    <div>
      <Headline id="new-skins">New Skins</Headline>
      <ItemList>
        {newSkins.map((skin) => <li key={skin.id}><SkinLink skin={skin}/><FormatDate date={skin.createdAt} relative/></li>)}
      </ItemList>

      <Headline id="categories">By Category</Headline>
      <ItemList>
        {byTypes.map((skin) => (
          <li key={`${skin.type}/${skin.subtype}`}>
            <Link href={`/skin/${[skin.type.toLowerCase(), skin.subtype?.toLowerCase()].filter(notNull).join('/')}`}>
              <a style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {skin._max.iconId && (<ItemIcon icon={{ id: skin._max.iconId, signature: iconMap[skin._max.iconId] }} size={32}/>)}
                {skin.type}{skin.subtype && ` / ${skin.subtype}`}
              </a>
            </Link>
            <FormatNumber value={skin._count}/>
          </li>
        ))}
      </ItemList>
    </div>
  );
};

function notNull<T>(x: T | null): x is T {
  return x != null;
}

export const getServerSideProps = getServerSideSuperProps<SkinPageProps>(async ({}) => {
  const newSkins = await db.skin.findMany({ take: 24, include: { icon: true }, orderBy: { createdAt: 'desc' }});
  const byTypes = await db.skin.groupBy({ by: ['type', 'subtype'], orderBy: [{ type: 'asc' }, { _count: { id: 'desc' }}], _count: true, _max: { iconId: true }});

  const icons = await db.icon.findMany({
    where: { id: { in: byTypes.map(({ _max }) => _max.iconId).filter(notNull) }}
  });

  const iconMap: Record<number, string> = Object.fromEntries(icons.map(({ id, signature }) => [id, signature]));

  return {
    props: { newSkins, byTypes, iconMap },
  };
});

export default withSuperProps(SkinPage);

