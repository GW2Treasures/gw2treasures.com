import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Item } from '../.prisma/database';
import { ItemIcon } from '../components/Item/ItemIcon';
import { ItemLink } from '../components/Item/ItemLink';
import { db } from '../lib/prisma';
import { getServerSideSuperProps, withSuperProps } from '../lib/superprops';

interface HomeProps {
  items: Item[];
}

const Home: NextPage<HomeProps> = ({ items }) => {
  const router = useRouter();

  return (
    <div>
      <h1>Home ({ router.locale })</h1>
      <Link href="/layout/detail">Detail Layout Demo</Link>
      <ul>
        {items.map((item) => <li key={item.id}><ItemLink item={item}/></li>)}
      </ul>
    </div>
  );
};

export const getServerSideProps = getServerSideSuperProps<HomeProps>(async ({}) => {
  // const [items] = await Promise.all([
  //   legacy.item.findMany({ take: 30, orderBy: { date_added: 'desc' } }),
  // ]);

  const items = await db.item.findMany({ take: 30, include: { icon: true }, orderBy: { createdAt: 'desc' }});

  return {
    props: { items },
  }
});

export default withSuperProps(Home);

