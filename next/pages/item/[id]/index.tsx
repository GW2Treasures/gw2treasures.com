import { GetStaticPaths, NextPage } from 'next';
import Link from 'next/link';
import { Item, ItemHistory, Language, Revision } from '../../../.prisma/database';
import { ItemTooltip } from '../../../components/Item/ItemTooltip';
import DetailLayout from '../../../components/Layout/DetailLayout';
import { Skeleton } from '../../../components/Skeleton/Skeleton';
import { Table } from '../../../components/Table/Table';
import { TableOfContentAnchor } from '../../../components/TableOfContent/TableOfContent';
import { ApiItem } from '../../../lib/apiTypes';
import { db } from '../../../lib/prisma';
import { getStaticSuperProps, withSuperProps } from '../../../lib/superprops';

export interface ItemPageProps {
  item: Item & {
    history: (ItemHistory & {
      revision: {
        id: string;
        buildId: number;
        createdAt: Date;
        description: string | null;
        language: Language;
      };
    })[];
  };
  revision: Revision;
  fixedRevision: boolean;
}

const ItemPage: NextPage<ItemPageProps> = ({ item, revision, fixedRevision }) => {
  if(!item) {
    return <DetailLayout title={<Skeleton/>} breadcrumb={<Skeleton/>}><Skeleton/></DetailLayout>;
  }

  const data: ApiItem = JSON.parse(revision.data);

  return (
    <DetailLayout title={data.name} icon={data.icon} breadcrumb={`Item › ${data.type} › ${data.details?.type}`}>
      {item.currentId_en !== revision.id && (
        <p>You are viewing an old revision of this item (Build {revision.buildId}). <Link href={`/item/${item.id}`}>View current.</Link></p>
      )}
      {item.currentId_en === revision.id && fixedRevision && (
        <p>You are viewing this item at a fixed revision (Build {revision.buildId}). <Link href={`/item/${item.id}`}>View current.</Link></p>
      )}

      <ItemTooltip item={data}/>

      <h2>
        <TableOfContentAnchor id="history">History</TableOfContentAnchor>
        History
      </h2>
      
      <Table>
        <thead>
          <tr><th {...{width: 1}}>Build</th><th {...{width: 1}}>Language</th><th>Description</th><th {...{width: 1}}>Date</th></tr>
        </thead>
        <tbody>
          {item.history.map((history) => (
            <tr>
              <td>{history.revisionId === revision.id ? <b>{history.revision.buildId}</b> : history.revision.buildId}</td>
              <td>{history.revision.language}</td>
              <td><Link href={`/item/${item.id}/${history.revisionId}`}>{history.revision.description}</Link></td>
              <td style={{ whiteSpace: 'nowrap' }}>{history.revision.createdAt.toDateString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </DetailLayout>
  );
};

export const getStaticProps = getStaticSuperProps<ItemPageProps>(async ({ params }) => {
  const id = Number(params!.id!.toString())!;

  const [item] = await Promise.all([
    db.item.findUnique({
      where: { id },
      include: { current_en: true, history: { include: { revision: { select: { id: true, buildId: true, createdAt: true, description: true, language: true } } }, where: { revision: { language: 'en' } } } }
    }),
  ]);

  if(!item) {
    return {
      notFound: true
    }
  }

  return {
    props: { item, revision: item.current_en, fixedRevision: false },
    revalidate: 600 /* 10 minutes */
  }
});

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: true,
  };
}

export default withSuperProps(ItemPage);
