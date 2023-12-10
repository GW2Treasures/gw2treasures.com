import type { Language } from '@gw2treasures/database';
import { db } from '@/lib/prisma';
import { remember } from '@/lib/remember';
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

const getCurrency = remember(60, async function getCurrency(id: number, language: Language) {
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
});

const getRevision = remember(60, async function getRevision(id: number, language: Language, revisionId?: string) {
  const revision = revisionId
    ? await db.revision.findUnique({ where: { id: revisionId }})
    : await db.revision.findFirst({ where: { [`currentCurrency_${language}`]: { id }}});

  return {
    revision,
    data: revision ? JSON.parse(revision.data) as Gw2Api.Currency : undefined,
  };
});


export default async function CurrencyPage({ params: { id, language }}: { params: { id: string, language: Language }}) {
  const currencyId = Number(id);
  const [currency, { revision, data }] = await Promise.all([
    getCurrency(currencyId, language),
    getRevision(currencyId, language)
  ]);

  if(!currency || !revision || !data) {
    notFound();
  }

  return (
    <DetailLayout title={data.name} breadcrumb="Currency" icon={currency.icon}>
      <p>{data.description}</p>

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
