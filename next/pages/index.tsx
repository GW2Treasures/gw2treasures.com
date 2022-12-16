import { Item } from '@prisma/client';
import { NextPage } from 'next';
import { FormatDate } from '@/components/Format/FormatDate';
import { Headline } from '@/components/Headline/Headline';
import { ItemLink } from '@/components/Item/ItemLink';
import { ItemList } from '@/components/ItemList/ItemList';
import { HeroLayout } from '@/components/Layout/HeroLayout';
import { Search } from '@/components/Search/Search';
import Icon from '../icons/Icon';
import { db } from '../lib/prisma';
import { getServerSideSuperProps, withSuperProps } from '../lib/superprops';

interface HomeProps {
  items: Item[];
}

const Home: NextPage<HomeProps> = ({ items }) => {
  return (
    <HeroLayout hero={(
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 64, padding: 32 }}>
        <div style={{ display: 'flex', flexDirection: 'column', color: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontFamily: 'Bitter', fontSize: 64, '--icon-size': '64px' }}><Icon icon="gw2treasures"/> gw2treasures.com</div>
          <div style={{ fontSize: 18, borderTop: '2px solid #fff', paddingTop: 8, fontWeight: 'bold', margin: '0 auto' }}>The Guild Wars 2® Database</div>
        </div>
        <Search/>
      </div>
    )}
    >
      <Headline id="new-items">New Items</Headline>
      <ItemList>
        {items.map((item) => <li key={item.id}><ItemLink item={item}/><FormatDate date={item.createdAt} relative/></li>)}
      </ItemList>
    </HeroLayout>
  );
};

export const getServerSideProps = getServerSideSuperProps<HomeProps>(async ({}) => {
  const items = await db.item.findMany({ take: 36, include: { icon: true }, orderBy: { createdAt: 'desc' }});

  return {
    props: { items },
  };
});

export default withSuperProps(Home);

