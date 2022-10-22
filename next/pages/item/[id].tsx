import { Item } from '@prisma/client';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import DetailLayout from '../../components/Layout/DetailLayout';
import { TableOfContentAnchor } from '../../components/TableOfContent/TableOfContent';
import { prisma } from '../../lib/prisma';
import { getServerSideSuperProps, getStaticSuperProps, withSuperProps } from '../../lib/superprops';

interface ItemPageProps {
  item: Item;
}

const ItemPage: NextPage<ItemPageProps> = ({ item }) => {
  if(!item) {
    return <>Loading</>;
  }

  return (
    <DetailLayout title={item.name_en} icon={`https://icons-gw2.darthmaim-cdn.com/${item.signature}/${item.file_id}-64px.png`} breadcrumb={`Item › ${item.type} › ${item.subtype}`}>
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
    prisma.item.findUnique({ where: { id: Number(params!.id!.toString())! }}),
  ]);

  if(!item) {
    return {
      notFound: true
    }
  }

  return {
    props: { item },
  }
});

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: true,
  };
}

export default withSuperProps(ItemPage);
