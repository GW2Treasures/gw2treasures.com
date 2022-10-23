import { Item } from '@prisma/client';
import { NextPage } from 'next';
import Link from 'next/link';
import { ItemIcon } from '../components/Item/ItemIcon';
import { ItemLink } from '../components/Item/ItemLink';
import { legacy } from '../lib/prisma';
import { getServerSideSuperProps, withSuperProps } from '../lib/superprops';

interface HomeProps {
  items: Item[];
}

const Home: NextPage<HomeProps> = ({ items }) => {
  return (
    <div>
      <h1>Home</h1>
      <Link href="/layout/detail">Detail Layout Demo</Link>
      <ul>
        {items.map((item) => <li key={item.id}><ItemLink item={item}/></li>)}
      </ul>
    </div>
  );
};

export const getServerSideProps = getServerSideSuperProps<HomeProps>(async ({}) => {
  const [items] = await Promise.all([
    legacy.item.findMany({ take: 30, orderBy: { date_added: 'desc' } }),
  ]);

  return {
    props: { items },
  }
});

export default withSuperProps(Home);

