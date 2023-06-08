import { Language } from '@gw2treasures/database';
import { db } from '@/lib/prisma';
import { remember } from '@/lib/remember';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import DetailLayout from '@/components/Layout/DetailLayout';
import { notFound } from 'next/navigation';
import { Gw2Api } from 'gw2-api-types';
import { Json } from '@/components/Format/Json';

export const dynamic = 'force-dynamic';

const getCurrency = remember(60, async function getCurrency(id: number, language: Language) {
  if(isNaN(id)) {
    notFound();
  }

  const currency = await db.currency.findUnique({
    where: { id },
    include: { icon: true },
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

      <Headline id="data">Data</Headline>
      <Json data={data}/>
    </DetailLayout>
  );
}
