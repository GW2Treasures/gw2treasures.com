import { db } from '@/lib/prisma';
import { FormatDate } from '@/components/Format/FormatDate';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { ItemList } from '@/components/ItemList/ItemList';
import { SkinLink } from '@/components/Skin/SkinLink';
import { EntityIcon } from '@/components/Entity/EntityIcon';
import Link from 'next/link';
import { FormatNumber } from '@/components/Format/FormatNumber';
import type { Icon } from '@gw2treasures/database';
import { cache } from '@/lib/cache';
import { Trans } from '@/components/I18n/Trans';
import type { Type } from '@/components/Item/ItemType.types';
import { createMetadata } from '@/lib/metadata';

const getSkins = cache(async () => {
  const [newSkins, byTypes] = await Promise.all([
    db.skin.findMany({ take: 24, include: { icon: true }, orderBy: { createdAt: 'desc' }}),
    db.skin.groupBy({ by: ['type', 'subtype'], orderBy: [{ type: 'asc' }, { _count: { id: 'desc' }}], _count: true, _max: { iconId: true }})
  ]);

  const icons = await db.icon.findMany({
    where: { id: { in: byTypes.map(({ _max }) => _max.iconId).filter(notNull) }}
  });

  const iconMap: Record<number, Icon> = Object.fromEntries(icons.map((icon) => [icon.id, icon]));

  return { newSkins, byTypes, iconMap };
}, ['skins'], { revalidate: 60 });

async function SkinPage() {
  const { newSkins, byTypes, iconMap } = await getSkins();

  return (
    <>
      <Headline id="new-skins">New Skins</Headline>
      <ItemList>
        {newSkins.map((skin) => <li key={skin.id}><SkinLink skin={skin}/><FormatDate date={skin.createdAt} relative/></li>)}
      </ItemList>

      <Headline id="categories">By Category</Headline>
      <ItemList>
        {byTypes.map((skin) => (
          <li key={`${skin.type}/${skin.subtype}`}>
            <Link
              href={`/skin/${[skin.type.toLowerCase(), skin.subtype?.toLowerCase()].filter(notNull).join('/')}`}
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}
            >
              {skin._max.iconId && (<EntityIcon icon={iconMap[skin._max.iconId]} size={32}/>)}
              <Trans id={`item.type.${skin.type as Type}`}/>{skin.subtype && <>&nbsp;/&nbsp;<Trans id={`item.type.${skin.type as Type}.${skin.subtype as never}`}/></>}
            </Link>
            <span>
              <FormatNumber value={skin._count}/> Skins
            </span>
          </li>
        ))}
      </ItemList>
    </>
  );
}

function notNull<T>(x: T | null): x is T {
  return x != null;
}

export default SkinPage;

export const generateMetadata = createMetadata({
  title: 'Skins'
});
