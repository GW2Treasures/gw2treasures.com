import { Item } from '@prisma/client';
import { NextPage } from 'next';
import Link from 'next/link';
import { prisma } from '../lib/prisma';
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
        {items.map((item) => <li><a href={`/item/${item.id}`}>{item.name_en}</a></li>)}
      </ul>
    </div>
  );
};

export const getServerSideProps = getServerSideSuperProps<HomeProps>(async ({}) => {
  const [items] = await Promise.all([
    prisma.item.findMany({ take: 30, orderBy: { date_added: 'desc' } }),
  ]);

  return {
    props: { items },
  }
});

export default withSuperProps(Home);

