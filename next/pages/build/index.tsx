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

interface BuildPageProps {
  builds: (Build & {
    _count: {
      revisions: number;
    };
  })[],
}

const BuildPage: NextPage<BuildPageProps> = ({ builds }) => {
  return (
    <PageLayout>
      <Headline id="Builds">Builds</Headline>
      <ItemList>
        {builds.map((build) => (
          <li key={build.id}>
            <span>
              <Link href={`/build/${build.id}`}>{build.id}</Link> (<FormatNumber value={build._count.revisions}/> changes)
            </span>
            <FormatDate date={build.createdAt} relative/>
          </li>
        ))}
      </ItemList>
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

