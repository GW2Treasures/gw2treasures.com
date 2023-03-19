import { FormatDate } from '@/components/Format/FormatDate';
import { Headline } from '@/components/Headline/Headline';
import { Trans } from '@/components/I18n/Trans';
import { ItemLink } from '@/components/Item/ItemLink';
import { ItemList } from '@/components/ItemList/ItemList';
import { HeroLayout } from '@/components/Layout/HeroLayout';
import { SkeletonLink } from '@/components/Link/SkeletonLink';
import { Search } from '@/components/Search/Search';
import { Suspense } from 'react';
import Icon from '../../icons/Icon';
import { db } from '@/lib/prisma';
import { remember } from '@/lib/remember';

export const dynamic = 'force-dynamic';

function HomePage() {
  return (
    <HeroLayout hero={(
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 64, padding: 32 }}>
        <div style={{ display: 'flex', flexDirection: 'column', color: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontFamily: 'var(--font-bitter)', fontSize: 64, '--icon-size': '64px' }}><Icon icon="gw2treasures"/> gw2treasures.com</div>
          <div style={{ fontSize: 18, borderTop: '2px solid #fff', paddingTop: 8, fontWeight: '500', margin: '0 auto' }}>The Guild Wars 2® Database</div>
        </div>
        <Search/>
      </div>
    )}
    >
      <Headline id="new-items">
        <Trans id="items.new"/>
      </Headline>
      <Suspense fallback={<NewItemsFallback/>}>
        {/* @ts-expect-error Server Component */}
        <NewItems/>
      </Suspense>
    </HeroLayout>
  );
};

const getNewItems = remember(15, function getNewItems() {
  return db.item.findMany({ take: 24, include: { icon: true }, orderBy: { createdAt: 'desc' }});
});

async function NewItems() {
  const items = await getNewItems();

  return (
    <ItemList>
      {items.map((item) => <li key={item.id}><ItemLink item={item}/><FormatDate date={item.createdAt} relative data-superjson/></li>)}
    </ItemList>
  );
}

function NewItemsFallback() {
  return (
    <ItemList>
      {[...new Array(24)].map((_, id) => {
        // eslint-disable-next-line react/no-array-index-key
        return (<li key={id}><SkeletonLink/></li>);
      })}
    </ItemList>
  );
}

export default HomePage;
