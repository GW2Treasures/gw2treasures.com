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
import { ItemList } from '../../../components/ItemList/ItemList';
import { ItemInfobox } from '../../../components/Item/ItemInfobox';
import { Coins } from '../../../components/Format/Coins';
import { Rarity } from '../../../components/Item/Rarity';

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
  similarItems?: (Item & { icon?: DbIcon | null })[]
}

const ItemPage: NextPage<ItemPageProps> = ({ item, revision, fixedRevision, similarItems = [] }) => {
  const router = useRouter();

  if(!item) {
    return <DetailLayout title={<Skeleton/>} breadcrumb={<Skeleton/>}><Skeleton/></DetailLayout>;
  }
  
  const data: ApiItem = JSON.parse(revision.data);

  return (
    <DetailLayout title={data.name} icon={item.icon && getIconUrl(item.icon, 64) || undefined} className={rarityClasses[data.rarity]} breadcrumb={`Item › ${data.type}${data.details ? ` › ${data.details?.type}` : ''}`} infobox={<ItemInfobox item={item} data={data}/>}>
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
            <tr key={history.revisionId}>
              <td>{history.revisionId === revision.id ? <b>{history.revision.buildId || '-'}</b> : history.revision.buildId || '-'}</td>
              <td>{history.revision.language}</td>
              <td><Link href={`/item/${item.id}/${history.revisionId}`}>{history.revision.description}</Link></td>
              <td><FormatDate date={history.revision.createdAt} relative/></td>
            </tr>
          ))}
        </tbody>
      </Table>

      {similarItems.length > 0 && (
        <>
          <Headline id="similar">Similar Items</Headline>

          <Table>
            <thead>
              <tr><th>Item</th><th>Level</th><th>Rarity</th><th>Type</th><th>Vendor Value</th></tr>
            </thead>
            <tbody>
              {similarItems.map((item) => (
                <tr key={item.id}>
                  <th><ItemLink item={item}/></th>
                  <td>{item.level}</td>
                  <td><Rarity rarity={item.rarity}/></td>
                  <td>{item.type} {item.subtype && `(${item.subtype})`}</td>
                  <td><Coins value={item.value}/></td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}

    <Headline id="data">Data</Headline>
    <pre style={{ fontSize: 16 }}>
      {JSON.stringify(data, undefined, '  ')}
    </pre>

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

  const similarItems = await db.item.findMany({
    where: {
      id: { not: id },
      OR: [
        { name_de: item.name_de },
        { name_en: item.name_en },
        { name_es: item.name_es },
        { name_fr: item.name_fr },
        { iconId: item.iconId },
        // TODO: Skin matches
        {
          type: item.type,
          subtype: item.subtype,
          rarity: item.rarity,
          weight: item.weight,
          value: item.value,
          level: item.level,
        }
      ]
    },
    include: { icon: true },
    take: 32,
  })

  return {
    props: { item, revision: revision, fixedRevision: false, similarItems },
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
