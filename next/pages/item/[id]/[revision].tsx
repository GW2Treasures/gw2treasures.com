import { GetStaticPaths } from 'next';
import ItemPage, { ItemPageProps } from './index';
import { db } from '../../../lib/prisma';
import { getStaticSuperProps } from '../../../lib/superprops';
import { Language } from '@prisma/client';

export const getStaticProps = getStaticSuperProps<ItemPageProps>(async ({ params, locale }) => {
  const id: number = Number(params!.id!.toString())!;
  const revisionId = params!.revision! as string;

  const [item, revision] = await Promise.all([
    db.item.findUnique({
      where: { id },
      include: {
        history: { include: { revision: { select: { id: true, buildId: true, createdAt: true, description: true, language: true }}}, where: { revision: { language: locale as Language }}, orderBy: { revision: { createdAt: 'desc' }}},
        icon: true,
      }
    }),
    db.revision.findFirst({ where: { id: revisionId, language: locale as Language, itemHistory: { some: { itemId: id }}}})
  ]);

  if(!item || !revision) {
    return {
      notFound: true
    };
  }

  return {
    props: { item, revision, fixedRevision: true },
    revalidate: 60 * 60 * 24 /* 1 day */
  };
});

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: true,
  };
};

export default ItemPage;
