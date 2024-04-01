import { db } from '@/lib/prisma';
import { HeroLayout } from '@/components/Layout/HeroLayout';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { CurrencyLink } from '@/components/Currency/CurrencyLink';
import { cache } from '@/lib/cache';
import { createDataTable } from '@gw2treasures/ui/components/Table/DataTable';
import { compareLocalizedName } from '@/lib/localizedName';
import type { Language } from '@gw2treasures/database';
import { ColumnSelect } from '@/components/Table/ColumnSelect';
import { FlexRow } from '@gw2treasures/ui/components/Layout/FlexRow';

const getCurrencies = cache(
  () => db.currency.findMany({
    orderBy: { order: 'asc' },
    include: { icon: true },
  }),
  ['currencies'],
  { revalidate: 60 }
);

export default async function CurrencyPage({ params: { language }}: { params: { language: Language }}) {
  const currencies = await getCurrencies();

  const Currencies = createDataTable(currencies, ({ id }) => id);

  return (
    <HeroLayout hero={<Headline id="currencies">Currencies</Headline>}>
      <p>
        <FlexRow align="right">
          <ColumnSelect table={Currencies}/>
        </FlexRow>
      </p>
      <Currencies.Table>
        <Currencies.Column id="id" title="Id" align="right" small hidden>{({ id }) => id}</Currencies.Column>
        <Currencies.Column id="currency" title="Currency" sort={compareLocalizedName(language)}>{(currency) => <CurrencyLink currency={currency}/>}</Currencies.Column>
        <Currencies.Column id="order" title="Order" align="right" hidden>{({ order }) => order}</Currencies.Column>
      </Currencies.Table>
    </HeroLayout>
  );
}

export const metadata = {
  title: 'Currencies'
};
