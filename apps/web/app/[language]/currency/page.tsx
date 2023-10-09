import { Language } from '@gw2treasures/database';
import { db } from '@/lib/prisma';
import { remember } from '@/lib/remember';
import { HeroLayout } from '@/components/Layout/HeroLayout';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { ItemList } from '@/components/ItemList/ItemList';
import { CurrencyLink } from '@/components/Currency/CurrencyLink';

const getCurrencies = remember(60, async function getCurrencies(language: Language) {
  const currencies = await db.currency.findMany({
    orderBy: { order: 'asc' },
    include: { icon: true },
  });

  return currencies;
});

export default async function CurrencyPage({ params: { language }}: { params: { language: Language }}) {
  const currencies = await getCurrencies(language);

  return (
    <HeroLayout hero={<Headline id="currencies">Currencies</Headline>}>
      <ItemList>
        {currencies.map((currency) => <li key={currency.id}><CurrencyLink currency={currency}/></li>)}
      </ItemList>
    </HeroLayout>
  );
}
