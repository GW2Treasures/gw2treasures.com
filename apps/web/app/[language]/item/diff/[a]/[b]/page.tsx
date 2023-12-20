import Link from 'next/link';
import type { Gw2Api } from 'gw2-api-types';
import { DiffLayout, DiffLayoutHeader, DiffLayoutRow } from '@/components/Layout/DiffLayout';
import { EntityIcon } from '@/components/Entity/EntityIcon';
import { parseIcon } from '@/lib/parseIcon';
import { FormatDate } from '@/components/Format/FormatDate';
import { Notice } from '@gw2treasures/ui/components/Notice/Notice';
import { Separator } from '@gw2treasures/ui/components/Layout/Separator';
import { Json } from '@/components/Format/Json';
import { notFound } from 'next/navigation';
import { Fragment } from 'react';
import { db } from '@/lib/prisma';
import { remember } from '@/lib/remember';
import { ClientItemTooltip } from '@/components/Item/ItemTooltip.client';
import { createTooltip } from '@/components/Item/ItemTooltip';
import type { Language } from '@gw2treasures/database';

const getRevisions = remember(60, async function getRevisions(idA: string, idB: string) {
  const [a, b] = await Promise.all([
    db?.revision.findUnique({ where: { id: idA, entity: 'Item' }}),
    db?.revision.findUnique({ where: { id: idB, entity: 'Item' }}),
  ]);

  if(!a || !b) {
    notFound();
  }

  return { a, b };
});

export default async function ItemDiffPage({ params }: { params: { a: string, b: string, language: Language }}) {
  const idA = params.a.toString();
  const idB = params.b.toString();

  const { a, b } = await getRevisions(idA, idB);

  const dataA: Gw2Api.Item = JSON.parse(a.data);
  const dataB: Gw2Api.Item = JSON.parse(b.data);

  const iconA = parseIcon(dataA.icon);
  const iconB = parseIcon(dataB.icon);

  const tooltipA = await createTooltip(dataA, params.language);
  const tooltipB = await createTooltip(dataB, params.language);

  return (
    <DiffLayout>
      <DiffLayoutHeader icons={[
        iconA && <EntityIcon icon={iconA} size={48}/>,
        iconB && <EntityIcon icon={iconB} size={48}/>,
      ]} title={[
        dataA.name,
        dataB.name,
      ]} subtitle={[
        <Fragment key="a"><FormatDate date={a.createdAt}/> (<Link href={`/build/${a.buildId}`}>Build {a.buildId}</Link>) ▪ <Link href={`/item/${dataA.id}/${a.id}`}>View revision</Link></Fragment>,
        <Fragment key="b"><FormatDate date={b.createdAt}/> (<Link href={`/build/${b.buildId}`}>Build {b.buildId}</Link>) ▪ <Link href={`/item/${dataB.id}/${b.id}`}>View revision</Link></Fragment>,
      ]}/>

      {dataA.id !== dataB.id && (
        <div style={{ padding: 16, paddingBottom: 0 }}>
          <Notice>You are comparing two different items</Notice>
        </div>
      )}

      {a.createdAt > b.createdAt && (
        <div style={{ padding: 16, paddingBottom: 0 }}>
          <Notice>You are comparing an old version against a newer version. <Link href={`/item/diff/${b.id}/${a.id}`}>Switch around</Link></Notice>
        </div>
      )}

      <DiffLayoutRow left={<ClientItemTooltip tooltip={tooltipA} hideTitle/>} right={<ClientItemTooltip tooltip={tooltipB} hideTitle/>}/>

      <DiffLayoutRow left={<Separator/>} right={<Separator/>}/>
      <DiffLayoutRow left={<Json data={dataA} borderless/>} right={<Json data={dataB} borderless/>} changed/>
    </DiffLayout>
  );
};

