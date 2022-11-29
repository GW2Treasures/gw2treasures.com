import { Build } from '@prisma/client';
import { NextPage } from 'next';
import { db } from '../../lib/prisma';
import { FormatDate } from '../../components/Format/FormatDate';
import { Headline } from '../../components/Headline/Headline';
import { ItemList } from '../../components/ItemList/ItemList';
import { getServerSideSuperProps, withSuperProps } from '../../lib/superprops';
import { FormatNumber } from '../../components/Format/FormatNumber';
import Link from 'next/link';

interface BuildPageProps {
  builds: (Build & {
    _count: {
        revisions: number;
    };
  })[],
}

const BuildPage: NextPage<BuildPageProps> = ({ builds }) => {
  return (
    <div>
      <Headline id="Builds">Builds</Headline>
      <ItemList>
        {builds.map((build) => <li key={build.id}><Link href={`/build/${build.id}`}>{build.id}</Link> (<FormatNumber value={build._count.revisions}/> changes) <FormatDate date={build.createdAt} relative/></li>)}
      </ItemList>
    </div>
  );
};

export const getServerSideProps = getServerSideSuperProps<BuildPageProps>(async ({}) => {
  const builds = await db.build.findMany({
    orderBy: { id: 'desc' },
    include: { _count: { select: { revisions: { where: { description: 'Updated in API' }}}}},
    where: { id: { not: 0 }}
  });

  return {
    props: { builds },
  };
});

export default withSuperProps(BuildPage);

