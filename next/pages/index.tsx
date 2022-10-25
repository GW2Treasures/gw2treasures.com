import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Item } from '../.prisma/database';
import { ItemLink } from '../components/Item/ItemLink';
import { Search } from '../components/Search/Search';
import Icon from '../icons/Icon';
import { db } from '../lib/prisma';
import { getServerSideSuperProps, withSuperProps } from '../lib/superprops';

interface HomeProps {
  items: Item[];
}

const Home: NextPage<HomeProps> = ({ items }) => {
  const router = useRouter();

  return (
    <div>
      <div style={{ marginTop: '-1px', display: 'flex', flexDirection: 'column', gap: 64, padding: '64px 16px', alignItems: 'center', background: '#b7000d', borderBottom: '1px solid rgba(0 0 0 / .066)', backgroundImage: 'linear-gradient(-35deg,transparent,transparent 50%,rgba(255 255 255 / .1) 90%)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', color: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontFamily: 'Bitter', fontSize: 64, '--icon-size': '64px' }}><Icon icon="gw2treasures"/> gw2treasures.com</div>
          <div style={{ fontSize: 18, borderTop: '2px solid #fff', paddingTop: 8, fontWeight: 'bold', margin: '0 auto' }}>The Guild Wars 2® Database</div>
        </div>
        <Search/>
      </div>

      <h1>Home ({ router.locale })</h1>
      <Link href="/layout/detail">Detail Layout Demo</Link>
      <ul>
        {items.map((item) => <li key={item.id}><ItemLink item={item}/></li>)}
      </ul>
    </div>
  );
};

export const getServerSideProps = getServerSideSuperProps<HomeProps>(async ({}) => {
  const items = await db.item.findMany({ take: 24, include: { icon: true }, orderBy: { createdAt: 'desc' }});

  return {
    props: { items },
  }
});

export default withSuperProps(Home);

