import { db } from '@/lib/prisma';
import { ItemGuesserGame } from './game';
import type { Language } from '@gw2treasures/database';
import { notFound } from 'next/navigation';

export default async function ItemGuesserPage({ params: { language }}: { params: { language: Language }}) {
  const count = await db.item.count({ where: { removedFromApi: false }});
  const item = await db.item.findFirst({
    take: 1,
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

export const metadata = {
  title: 'Item Guesser'
};
