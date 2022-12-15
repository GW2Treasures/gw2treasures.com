import { GetServerSideProps } from 'next';
import { db } from '../../lib/prisma';

export const getServerSideProps: GetServerSideProps = async ({}) => {
  const count = await db.achievement.count();

  const achievement = await db.achievement.findFirst({ take: 1, skip: Math.floor(Math.random() * count), select: { id: true }});

  if(!achievement) {
    return { notFound: true };
  }

  return {
    redirect: {
      permanent: false,
      destination: `/achievement/${achievement.id}`
    },
    revalidate: true,
  };
};

const Noop = () => null;

export default Noop;
