import { db } from '@/lib/prisma';
import { HeroLayout } from '@/components/Layout/HeroLayout';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { CurrencyLink } from '@/components/Currency/CurrencyLink';
import { cache } from '@/lib/cache';
import { createDataTable } from '@gw2treasures/ui/components/Table/DataTable';
import { compareLocalizedName } from '@/lib/localizedName';
import { ColumnSelect } from '@/components/Table/ColumnSelect';
import { AccountHeader, AccountWalletRow } from './account-data';
import type { PageProps } from '@/lib/next';
import { getTranslate } from '@/lib/translate';
import { Trans } from '@/components/I18n/Trans';
import { currencyCategoryById } from '@gw2treasures/static-data/currencies/categories';
import type { Metadata } from 'next';
import { Description } from '@/components/Layout/Description';
import { getAlternateUrls } from '@/lib/url';

const getCurrencies = cache(
  () => db.currency.findMany({
    orderBy: { order: 'asc' },
    include: { icon: true },
  }),
  ['currencies'],
  { revalidate: 60 }
);

export default async function CurrencyPage({ params }: PageProps) {
  const { language } = await params;
  const t = getTranslate(language);

  const currencies = await getCurrencies();
  const Currencies = createDataTable(currencies, ({ id }) => id);

  return (
    <HeroLayout hero={<Headline id="currencies"><Trans id="currencies"/></Headline>}>
      <Description actions={<ColumnSelect table={Currencies}/>}>
        <Trans id="currencies.description"/>
      </Description>

      <Currencies.Table>
        <Currencies.Column id="id" title="Id" align="right" sortBy="id" small hidden>{({ id }) => id}</Currencies.Column>
        <Currencies.Column id="currency" title={<Trans id="currency"/>} sort={compareLocalizedName(language)}>{(currency) => <CurrencyLink currency={currency}/>}</Currencies.Column>
        <Currencies.Column id="category" title={<Trans id="currency.category"/>}>{({ id }) => currencyCategoryById[id]?.map((category) => t(`currency.category.${category}`)).join(', ')}</Currencies.Column>
        <Currencies.Column id="order" title={<Trans id="currency.order"/>} sortBy="order" align="right" hidden>{({ order }) => order}</Currencies.Column>
        <Currencies.DynamicColumns id="account-wallet" title="Account Wallets" headers={<AccountHeader/>}>
          {({ id }) => <AccountWalletRow currencyId={id}/>}
        </Currencies.DynamicColumns>
      </Currencies.Table>
    </HeroLayout>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { language } = await params;
  const t = getTranslate(language);

  return {
    title: t('currencies'),
    description: t('currencies.description'),
    alternates: getAlternateUrls('/homestead/materials', language),
    keywords: ['currency', 'wallet', 'key', 'map currency', 'black lion', 'gems', 'coins', 'gold', 'silver', 'copper', 'karma'],
    // TODO(og): Add og image
  };
}
