import { db } from '@/lib/prisma';
import { HeroLayout } from '@/components/Layout/HeroLayout';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { ItemList } from '@/components/ItemList/ItemList';
import { CurrencyLink } from '@/components/Currency/CurrencyLink';
import { cache } from '@/lib/cache';

const getCurrencies = cache(
  () => db.currency.findMany({
    orderBy: { order: 'asc' },
    include: { icon: true },
  }),
  ['currencies'],
  { revalidate: 60 }
);

export default async function CurrencyPage() {
  const currencies = await getCurrencies();

  return (
    <HeroLayout hero={<Headline id="currencies">Currencies</Headline>}>
      <ItemList>
        {currencies.map((currency) => <li key={currency.id}><CurrencyLink currency={currency}/></li>)}
      </ItemList>
    </HeroLayout>
  );
}
