import { CurrencyLink } from '@/components/Currency/CurrencyLink';
import { Gw2AccountBodyCells, Gw2AccountHeaderCells } from '@/components/Gw2Api/Gw2AccountTableCells';
import { Trans } from '@/components/I18n/Trans';
import { Description } from '@/components/Layout/Description';
import { HeroLayout } from '@/components/Layout/HeroLayout';
import { ColumnSelect } from '@/components/Table/ColumnSelect';
import { cache } from '@/lib/cache';
import { compareLocalizedName } from '@/lib/localizedName';
import { db } from '@/lib/prisma';
import { getLanguage, getTranslate } from '@/lib/translate';
import { Scope } from '@gw2me/client';
import { currencyCategoryById } from '@gw2treasures/static-data/currencies/categories';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { createDataTable } from '@gw2treasures/ui/components/Table/DataTable';
import { AccountWalletCell } from './account-data';
import { createMetadata } from '@/lib/metadata';

const requiredScopes = [Scope.GW2_Wallet];

const getCurrencies = cache(
  () => db.currency.findMany({
    orderBy: { order: 'asc' },
    include: { icon: true },
  }),
  ['currencies'],
  { revalidate: 60 }
);

export default async function CurrencyPage() {
  const language = await getLanguage();
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
        <Currencies.DynamicColumns id="account-wallet" title="Account Wallets" headers={<Gw2AccountHeaderCells requiredScopes={requiredScopes} align="right"/>}>
          {({ id }) => <Gw2AccountBodyCells requiredScopes={requiredScopes}><AccountWalletCell currencyId={id} accountId={undefined as never}/></Gw2AccountBodyCells>}
        </Currencies.DynamicColumns>
      </Currencies.Table>
    </HeroLayout>
  );
}

export const generateMetadata = createMetadata(async () => {
  const language = await getLanguage();
  const t = getTranslate(language);

  return {
    title: t('currencies'),
    description: t('currencies.description'),
    keywords: ['currency', 'wallet', 'key', 'map currency', 'black lion', 'gems', 'coins', 'gold', 'silver', 'copper', 'karma'],
  };
});
