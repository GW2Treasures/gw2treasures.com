import { db } from '@/lib/prisma';
import { ItemGuesserGame } from './game';
import { notFound } from 'next/navigation';
import { createMetadata } from '@/lib/metadata';

export default async function ItemGuesserPage() {
  const count = await db.item.count({ where: { removedFromApi: false }});
  const item = await db.item.findFirst({
    take: 1,
    // eslint-disable-next-line react-hooks/purity
    skip: Math.floor(Math.random() * count),
    where: { removedFromApi: false },
    include: { icon: true }
  });

  if(!item) {
    notFound();
  }

  return (
    <ItemGuesserGame challengeItem={item} key={item.id}/>
  );
}

export const generateMetadata = createMetadata({
  title: 'Item Guesser'
});
