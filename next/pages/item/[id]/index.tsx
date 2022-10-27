import { GetStaticPaths, NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Icon as DbIcon, Item, ItemHistory, Language, Revision } from '@prisma/client';
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
import { getIconUrl } from '../../../components/Item/ItemIcon';
import { Headline } from '../../../components/Headline/Headline';
import { FormatDate } from '../../../components/Format/FormatDate';

export interface ItemPageProps {
  item: Item & {
    icon?: DbIcon | null,
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
    <DetailLayout title={data.name} icon={item.icon && getIconUrl(item.icon, 64) || undefined} className={rarityClasses[data.rarity]} breadcrumb={`Item › ${data.type}${data.details ? ` › ${data.details?.type}` : ''}`} infobox={
      <div>
        {router.locale !== 'de' && (<div>DE: <ItemLink icon="none" item={item} locale="de"/></div>)}
        {router.locale !== 'en' && (<div>EN: <ItemLink icon="none" item={item} locale="en"/></div>)}
        {router.locale !== 'es' && (<div>ES: <ItemLink icon="none" item={item} locale="es"/></div>)}
        {router.locale !== 'fr' && (<div>FR: <ItemLink icon="none" item={item} locale="fr"/></div>)}
        <a href={`https://api.guildwars2.com/v2/items/${item.id}?v=latest&lang=${router.locale}`} target="api" rel="noreferrer noopener">API</a>
      </div>
    }>
      {item[`currentId_${router.locale as Language}`] !== revision.id && (
        <Infobox icon="revision">You are viewing an old revision of this item (Build {revision.buildId || 'unknown'}). <Link href={`/item/${item.id}`}>View current.</Link></Infobox>
      )}
      {item[`currentId_${router.locale as Language}`] === revision.id && fixedRevision && (
        <Infobox icon="revision">You are viewing this item at a fixed revision (Build {revision.buildId || 'unknown'}). <Link href={`/item/${item.id}`}>View current.</Link></Infobox>
      )}
      {!fixedRevision && item.removedFromApi && (
        <Infobox type="warning" icon="revision">This item is currently not available in the Guild Wars 2 Api and you are seeing the last know version. The item has either been removed from the game or needs to be rediscovered.</Infobox>
      )}

      <TableOfContentAnchor id="tooltip">Tooltip</TableOfContentAnchor>
      <ItemTooltip item={data}/>

      <Headline id="history">History</Headline>
      
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
              <td><FormatDate date={history.revision.createdAt} relative/></td>
            </tr>
          ))}
        </tbody>
      </Table>
    </DetailLayout>
  );
};

export const getStaticProps = getStaticSuperProps<ItemPageProps>(async ({ params, locale }) => {
  const id = Number(params!.id!.toString())!;
  const language = (locale ?? 'en') as Language;

  const [item, revision] = await Promise.all([
    db.item.findUnique({
      where: { id },
      include: { 
        history: {
          include: { revision: { select: { id: true, buildId: true, createdAt: true, description: true, language: true } } },
          where: { revision: { language } },
          orderBy: { revision: { createdAt: 'desc' } } 
        },
        icon: true
      }
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
