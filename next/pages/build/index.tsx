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

interface BuildPageProps {
  builds: BuildWithRevisionCount[],
}

const buildTableColumns: DataTableColumn<BuildWithRevisionCount>[] = [
  { key: 'id', label: 'Build', value: (build) => <Link href={`/build/${build.id}`}>{build.id}</Link> },
  { key: 'changes', label: 'Changes', value: (build) => <FormatNumber value={build._count.revisions}/> },
  { key: 'created', label: 'Date', value: (build) => <FormatDate date={build.createdAt}/>, small: true },
];

const buildRowKey = (build: Build) => build.id;

const BuildPage: NextPage<BuildPageProps> = ({ builds }) => {
  const BuildTable = useDataTable<BuildWithRevisionCount>(buildTableColumns, buildRowKey);

  return (
    <PageLayout>
      <Headline id="Builds">Builds</Headline>
      <BuildTable rows={builds}/>
    </PageLayout>
  );
};

export const getServerSideProps = getServerSideSuperProps<BuildPageProps>(async ({ locale }) => {
  const language = (locale ?? 'en') as Language;

  const builds = await db.build.findMany({
    orderBy: { id: 'desc' },
    include: { _count: { select: { revisions: { where: { description: 'Updated in API', language }}}}},
    where: { id: { not: 0 }}
  });

  return {
    props: { builds },
  };
});

export default withSuperProps(BuildPage);

