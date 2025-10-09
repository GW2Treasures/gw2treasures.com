'use client';

import { useFormatContext } from '@/components/Format/FormatContext';
import { FormatDate } from '@/components/Format/FormatDate';
import { FormatNumber } from '@/components/Format/FormatNumber';
import { type DataTableColumn, useDataTable } from '@gw2treasures/ui/components/Table/use-datatable';
import type { Build } from '@gw2treasures/database';
import Link from 'next/link';
import { type FC, useCallback, useMemo } from 'react';


type Update = { entity: string | null, buildId: number, _count: { _all: number }};

type BuildWithUpdates = { build: Build, updates: Update[] };

function updateCount(updates: Update[], type: string): number {
  return updates.find((u) => u.entity === type)?._count._all ?? 0;
}

const buildTableColumns: DataTableColumn<BuildWithUpdates>[] = [
  { key: 'id', label: 'Build', value: ({ build }) => <Link href={`/build/${build.id}`}>{build.id}</Link> },
  { key: 'items', label: 'Item Updates', value: ({ updates }) => <FormatNumber value={updateCount(updates, 'Item')}/>, sort: (a, b) => updateCount(a.updates, 'Item') - updateCount(b.updates, 'Item') },
  { key: 'skills', label: 'Skill Updates', value: ({ updates }) => <FormatNumber value={updateCount(updates, 'Skill')}/>, sort: (a, b) => updateCount(a.updates, 'Skill') - updateCount(b.updates, 'Skill') },
  { key: 'created', label: 'Date', value: ({ build }) => <FormatDate date={build.createdAt}/>, small: true },
];

const buildRowKey = ({ build }: BuildWithUpdates) => build.id;


export interface BuildTableProps {
  rows: BuildWithUpdates[],
}

export const BuildTable: FC<BuildTableProps> = ({ rows }) => {
  const { locale } = useFormatContext();
  const f = useMemo(() => new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }), [locale]);

  const group = useCallback(
    ({ build }: BuildWithUpdates) => ({ value: `${build.createdAt.getMonth()}-${build.createdAt.getFullYear()}`, label: <b>{f.format(build.createdAt)}</b> }),
    [f]
  );

  // TODO: replace with @gw2treasures/ui DataTable
  const BuildTable = useDataTable<BuildWithUpdates>(buildTableColumns, buildRowKey, group);

  // eslint-disable-next-line react-hooks/static-components
  return <BuildTable rows={rows}/>;
};
