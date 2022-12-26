import { GetServerSideProps } from 'next';
import { db } from '../../lib/prisma';

export const getServerSideProps: GetServerSideProps = async ({}) => {
  const count = await db.item.count();

  const item = await db.item.findFirst({ take: 1, skip: Math.floor(Math.random() * count), select: { id: true }});

  if(!item) {
    return { notFound: true };
  }

  return {
    redirect: {
      permanent: false,
      destination: `/item/${item.id}`
    },
  };
};

const Noop = () => null;

export default Noop;
