import { Item } from '@prisma/client';
import { GetStaticPaths, NextPage } from 'next';
import { ItemTooltip } from '../../components/Item/ItemTooltip';
import DetailLayout from '../../components/Layout/DetailLayout';
import { Skeleton } from '../../components/Skeleton/Skeleton';
import { TableOfContentAnchor } from '../../components/TableOfContent/TableOfContent';
import { legacy } from '../../lib/prisma';
import { getStaticSuperProps, withSuperProps } from '../../lib/superprops';

interface ItemPageProps {
  item: Item;
}

const ItemPage: NextPage<ItemPageProps> = ({ item }) => {
  if(!item) {
    return <DetailLayout title={<Skeleton/>} breadcrumb={<Skeleton/>}><Skeleton/></DetailLayout>;
  }

  return (
    <DetailLayout title={item.name_en} icon={`https://icons-gw2.darthmaim-cdn.com/${item.signature}/${item.file_id}-64px.png`} breadcrumb={`Item › ${item.type} › ${item.subtype}`}>
      <ItemTooltip item={item}/>

      <h2>
        <TableOfContentAnchor id="history">History</TableOfContentAnchor>
        History
      </h2>
      
      Added {item.date_added.toDateString()}.
    </DetailLayout>
  );
};

export const getStaticProps = getStaticSuperProps<ItemPageProps>(async ({ params }) => {
  const [item] = await Promise.all([
    legacy.item.findUnique({ where: { id: Number(params!.id!.toString())! }}),
  ]);

  if(!item) {
    return {
      notFound: true
    }
  }

  return {
    props: { item },
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
