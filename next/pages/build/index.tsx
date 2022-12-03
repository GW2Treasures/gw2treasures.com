import { Build, Language } from '@prisma/client';
import { NextPage } from 'next';
import { db } from '../../lib/prisma';
import { FormatDate } from '../../components/Format/FormatDate';
import { Headline } from '../../components/Headline/Headline';
import { ItemList } from '../../components/ItemList/ItemList';
import { getServerSideSuperProps, withSuperProps } from '../../lib/superprops';
import { FormatNumber } from '../../components/Format/FormatNumber';
import Link from 'next/link';
import { PageLayout } from '../../components/Layout/PageLayout';
import { DataTableColumn, useDataTable } from '../../components/Table/DataTable';

type BuildWithRevisionCount = Build & {
  _count: {
    revisions: number;
  };
};

type Update = { entity: string | null, buildId: number, _count: { _all: number }};

type BuildWithUpdates = { build: Build, updates: Update[] };

interface BuildPageProps {
  builds: BuildWithRevisionCount[],
  updates: Update[]
}

const buildTableColumns: DataTableColumn<BuildWithUpdates>[] = [
  { key: 'id', label: 'Build', value: ({ build }) => <Link href={`/build/${build.id}`}>{build.id}</Link> },
  { key: 'items', label: 'Item Updates', value: ({ updates }) => <FormatNumber value={updates.find((u) => u.entity === 'Item')?._count._all ?? 0}/> },
  { key: 'items', label: 'Skill Updates', value: ({ updates }) => <FormatNumber value={updates.find((u) => u.entity === 'Skill')?._count._all ?? 0}/> },
  { key: 'created', label: 'Date', value: ({ build }) => <FormatDate date={build.createdAt}/>, small: true },
];

const buildRowKey = ({ build }: BuildWithUpdates) => build.id;

const BuildPage: NextPage<BuildPageProps> = ({ builds, updates }) => {
  const buildsWithUpdates = builds.map((build) => ({
    build,
    updates: updates.filter(({ buildId }) => buildId === build.id)
  }));

  const BuildTable = useDataTable<BuildWithUpdates>(buildTableColumns, buildRowKey);

  return (
    <PageLayout>
      <Headline id="Builds">Builds</Headline>
      <BuildTable rows={buildsWithUpdates}/>
    </PageLayout>
  );
};

export const getServerSideProps = getServerSideSuperProps<BuildPageProps>(async ({ locale }) => {
  const language = (locale ?? 'en') as Language;

  const builds = await db.build.findMany({
    orderBy: { id: 'desc' },
    include: { _count: { select: { revisions: { where: { type: 'Update', language }}}}},
    where: { id: { not: 0 }}
  });

  const updates = await db.revision.groupBy({
    by: ['buildId', 'entity'],
    where: { type: 'Update', language, buildId: { in: builds.map((build) => build.id) }},
    _count: { _all: true },
  });

  return {
    props: { builds, updates },
  };
});

export default withSuperProps(BuildPage);

