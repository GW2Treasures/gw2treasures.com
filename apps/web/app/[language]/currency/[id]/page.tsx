import type { Language } from '@gw2treasures/database';
import { db } from '@/lib/prisma';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import DetailLayout from '@/components/Layout/DetailLayout';
import { notFound } from 'next/navigation';
import type { Gw2Api } from 'gw2-api-types';
import { Json } from '@/components/Format/Json';
import { linkProperties } from '@/lib/linkProperties';
import { ItemList } from '@/components/ItemList/ItemList';
import { CurrencyValue } from '@/components/Currency/CurrencyValue';
import { ItemLink } from '@/components/Item/ItemLink';
import { Suspense } from 'react';
import { SkeletonTable } from '@/components/Skeleton/SkeletonTable';
import { CurrencyIngredientFor } from '@/components/Currency/CurrencyIngredientFor';
import { pageView } from '@/lib/pageView';
import { cache } from '@/lib/cache';
import { localizedName } from '@/lib/localizedName';
import { getUser } from '@/lib/getUser';
import { WalletTable } from './wallet-table';

const getCurrency = cache(async (id: number) => {
  if(isNaN(id)) {
    notFound();
  }

  const currency = await db.currency.findUnique({
    where: { id },
    include: {
      icon: true,
      containedIn: { include: { containerItem: { select: linkProperties }}},
      _count: {
        select: { ingredient: true }
      }
    },
  });

  return currency;
}, ['currency'], { revalidate: 60 });

const getRevision = cache(async (id: number, language: Language, revisionId?: string) => {
  const revision = revisionId
    ? await db.revision.findUnique({ where: { id: revisionId }})
    : await db.revision.findFirst({ where: { [`currentCurrency_${language}`]: { id }}});

  return {
    revision,
    data: revision ? JSON.parse(revision.data) as Gw2Api.Currency : undefined,
  };
}, ['currency-revision'], { revalidate: 60 });

interface CurrencyPageProps {
  params: {
    id: string;
    language: Language;
  };
}

export default async function CurrencyPage({ params: { id, language }}: CurrencyPageProps) {
  const currencyId = Number(id);
  const [currency, { revision, data }, user] = await Promise.all([
    getCurrency(currencyId),
    getRevision(currencyId, language),
    getUser(),
    pageView('currency', currencyId),
  ]);

  if(!currency || !revision || !data) {
    notFound();
  }

  return (
    <DetailLayout title={data.name} breadcrumb="Currency" icon={currency.icon}>
      <p>{data.description}</p>

      {user && (
        <>
          <Headline id="wallet">Wallet</Headline>
          <WalletTable currencyId={currency.id}/>
        </>
      )}

      {currency.containedIn.length > 0 && (
        <>
          <Headline id="containedIn">Contained In</Headline>

          <ItemList>
            {currency.containedIn.map((contained) => (
              <li key={contained.currencyId}>
                <span style={{ display: 'flex', flex: 1, alignItems: 'center', gap: 8 }}>
                  <ItemLink item={contained.containerItem}/>
                  <span>
                    ({contained.min === contained.max
                      ? <CurrencyValue currencyId={contained.currencyId} value={contained.min}/>
                      : <><CurrencyValue currencyId={contained.currencyId} value={contained.min}/> – <CurrencyValue currencyId={contained.currencyId} value={contained.max}/></>
                    })
                  </span>
                </span>
              </li>
            ))}
          </ItemList>
        </>
      )}

      {currency._count.ingredient > 0 && (
        <Suspense fallback={(
          <>
            <Headline id="crafting">Used in crafting</Headline>
            <SkeletonTable columns={['Output', 'Rating', 'Disciplines', 'Ingredients']} rows={currency._count.ingredient}/>
          </>
        )}
        >
          <CurrencyIngredientFor currencyId={currency.id}/>
        </Suspense>
      )}

      <Headline id="data">Data</Headline>
      <Json data={data}/>
    </DetailLayout>
  );
}

export async function generateMetadata({ params: { id, language }}: CurrencyPageProps) {
  const currencyId = Number(id);
  const currency = await getCurrency(currencyId);

  if(!currency) {
    return notFound();
  }

  return {
    title: localizedName(currency, language)
  };
}
