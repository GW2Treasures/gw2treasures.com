import { GetStaticPaths, NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Item, ItemHistory, Language, Revision } from '../../../.prisma/database';
import { ItemLink } from '../../../components/Item/ItemLink';
import { ItemTooltip } from '../../../components/Item/ItemTooltip';
import DetailLayout from '../../../components/Layout/DetailLayout';
import { Skeleton } from '../../../components/Skeleton/Skeleton';
import { Table } from '../../../components/Table/Table';
import { TableOfContentAnchor } from '../../../components/TableOfContent/TableOfContent';
import { ApiItem } from '../../../lib/apiTypes';
import { db } from '../../../lib/prisma';
import { getStaticSuperProps, withSuperProps } from '../../../lib/superprops';
import rarityClasses from '../../../components/Layout/RarityColor.module.css';
import { Infobox } from '../../../components/Infobox/Infobox';
import Icon from '../../../icons/Icon';

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
  
  const router = useRouter();

  const data: ApiItem = JSON.parse(revision.data);

  return (
    <DetailLayout title={data.name} icon={data.icon} className={rarityClasses[data.rarity]} breadcrumb={`Item › ${data.type} › ${data.details?.type}`} infobox={
    <>
      {router.locale !== 'de' && (<div>DE: <ItemLink item={item} locale="de"/></div>)}
      {router.locale !== 'en' && (<div>EN: <ItemLink item={item} locale="en"/></div>)}
      {router.locale !== 'es' && (<div>ES: <ItemLink item={item} locale="es"/></div>)}
      {router.locale !== 'fr' && (<div>FR: <ItemLink item={item} locale="fr"/></div>)}
    </>
    }>
      {item[`currentId_${router.locale as Language}`] !== revision.id && (
        <Infobox><Icon icon="revision"/> You are viewing an old revision of this item (Build {revision.buildId || 'unknown'}). <Link href={`/item/${item.id}`}>View current.</Link></Infobox>
      )}
      {item[`currentId_${router.locale as Language}`] === revision.id && fixedRevision && (
        <Infobox><Icon icon="revision"/> You are viewing this item at a fixed revision (Build {revision.buildId || 'unknown'}). <Link href={`/item/${item.id}`}>View current.</Link></Infobox>
      )}

      <TableOfContentAnchor id="tooltip">Tooltip</TableOfContentAnchor>
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
              <td>{history.revisionId === revision.id ? <b>{history.revision.buildId || '-'}</b> : history.revision.buildId || '-'}</td>
              <td>{history.revision.language}</td>
              <td><Link href={`/item/${item.id}/${history.revisionId}`}>{history.revision.description}</Link></td>
              <td style={{ whiteSpace: 'nowrap' }}>{history.revision.createdAt.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      
      <h2>
        <TableOfContentAnchor id="debug">Debug</TableOfContentAnchor>
        Debug
      </h2>

      <pre>{JSON.stringify(data, undefined, '  ')}</pre>
    </DetailLayout>
  );
};

export const getStaticProps = getStaticSuperProps<ItemPageProps>(async ({ params, locale }) => {
  const id = Number(params!.id!.toString())!;
  const language = (locale ?? 'en') as Language;

  const [item, revision] = await Promise.all([
    db.item.findUnique({
      where: { id },
      include: { history: { include: { revision: { select: { id: true, buildId: true, createdAt: true, description: true, language: true } } }, where: { revision: { language } }, orderBy: { revision: { createdAt: 'desc' } } } }
    }),
    db.revision.findFirst({ where: { [`currentItem_${language}`]: { id } } })
  ]);

  if(!item || !revision) {
    return {
      notFound: true
    }
  }

  return {
    props: { item, revision: revision, fixedRevision: false },
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
