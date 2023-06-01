import { db } from '@/lib/prisma';
import { FormatDate } from '@/components/Format/FormatDate';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { ItemList } from '@/components/ItemList/ItemList';
import { SkinLink } from '@/components/Skin/SkinLink';
import { EntityIcon } from '@/components/Entity/EntityIcon';
import Link from 'next/link';
import { FormatNumber } from '@/components/Format/FormatNumber';
import { HeroLayout } from '@/components/Layout/HeroLayout';
import { remember } from '@/lib/remember';
import { Icon } from '@gw2treasures/database';

export const dynamic = 'force-dynamic';

const getSkins = remember(60, async function getSkins() {
  const [newSkins, byTypes] = await Promise.all([
    db.skin.findMany({ take: 24, include: { icon: true }, orderBy: { createdAt: 'desc' }}),
    db.skin.groupBy({ by: ['type', 'subtype'], orderBy: [{ type: 'asc' }, { _count: { id: 'desc' }}], _count: true, _max: { iconId: true }})
  ]);

  const icons = await db.icon.findMany({
    where: { id: { in: byTypes.map(({ _max }) => _max.iconId).filter(notNull) }}
  });

  const iconMap: Record<number, Icon> = Object.fromEntries(icons.map((icon) => [icon.id, icon]));

  return { newSkins, byTypes, iconMap };
});

async function SkinPage() {
  const { newSkins, byTypes, iconMap } = await getSkins();

  return (
    <HeroLayout hero={<Headline id="skins">Skins</Headline>} color="#2c8566">
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
              {skin.type}{skin.subtype && ` / ${skin.subtype}`}
            </Link>
            <span>
              <FormatNumber value={skin._count}/> Skins
            </span>
          </li>
        ))}
      </ItemList>
    </HeroLayout>
  );
};

function notNull<T>(x: T | null): x is T {
  return x != null;
}

export default SkinPage;
