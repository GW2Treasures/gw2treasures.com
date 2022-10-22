import { Item } from '@prisma/client';
import { NextPage } from 'next';
import DetailLayout from '../../components/Layout/DetailLayout';
import { TableOfContentAnchor } from '../../components/TableOfContent/TableOfContent';
import { prisma } from '../../lib/prisma';
import { getServerSideSuperProps, withSuperProps } from '../../lib/superprops';

interface ItemPageProps {
  item: Item;
}

const ItemPage: NextPage<ItemPageProps> = ({ item }) => {
  return (
    <DetailLayout title={item.name_en} icon={`https://icons-gw2.darthmaim-cdn.com/${item.signature}/${item.file_id}-64px.png`} breadcrumb="Item">
      <h2>
        <TableOfContentAnchor id="history">History</TableOfContentAnchor>
        History
      </h2>
      Added {item.date_added.toDateString()}.
    </DetailLayout>
  );
};

export const getServerSideProps = getServerSideSuperProps<ItemPageProps>(async ({ params }) => {
  const [item] = await Promise.all([
    prisma.item.findUniqueOrThrow({ where: { id: Number(params.id.toString()) }}),
  ]);

  return {
    props: { item },
  }
});

export default withSuperProps(ItemPage);
