import { GetStaticPaths, NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Icon as DbIcon, IngredientItem, Item, ItemHistory, Language, Recipe, Revision, Skin } from '@prisma/client';
import { ItemLink } from '../../../components/Item/ItemLink';
import { ItemTooltip } from '../../../components/Item/ItemTooltip';
import DetailLayout from '../../../components/Layout/DetailLayout';
import { Skeleton } from '../../../components/Skeleton/Skeleton';
import { Table } from '../../../components/Table/Table';
import { TableOfContentAnchor } from '../../../components/TableOfContent/TableOfContent';
import { Gw2Api } from 'gw2-api-types';
import { db } from '../../../lib/prisma';
import { getStaticSuperProps, withSuperProps } from '../../../lib/superprops';
import rarityClasses from '../../../components/Layout/RarityColor.module.css';
import { Infobox } from '../../../components/Infobox/Infobox';
import { getIconUrl, ItemIcon } from '../../../components/Item/ItemIcon';
import { Headline } from '../../../components/Headline/Headline';
import { FormatDate } from '../../../components/Format/FormatDate';
import { ItemList } from '../../../components/ItemList/ItemList';
import { ItemInfobox } from '../../../components/Item/ItemInfobox';
import { Coins } from '../../../components/Format/Coins';
import { Rarity } from '../../../components/Item/Rarity';
import { SkinLink } from '../../../components/Skin/SkinLink';
import { Json } from '../../../components/Format/Json';
import { ItemTable } from '../../../components/Item/ItemTable';
import { Ingredients } from '../../../components/Recipe/Ingredients';
import { RecipeBox } from '../../../components/Recipe/RecipeBox';
import { RecipeTable } from '../../../components/Recipe/RecipeTable';

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
    unlocksSkin: (Skin & {
      icon?: DbIcon | null,
    })[];
    recipeOutput: (Recipe & {
      currentRevision: Revision,
      itemIngredients: (IngredientItem & { Item: Item & { icon: DbIcon | null; }; })[]
    })[];
    ingredient: (IngredientItem & {
      Recipe: Recipe & {
          outputItem: (Item & {
              icon: DbIcon | null;
          }) | null;
          currentRevision: Revision;
          itemIngredients: (IngredientItem & {
            Item: Item & { icon: DbIcon | null; };
          })[];
      };
  })[]
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

  const data: Gw2Api.Item = JSON.parse(revision.data);

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

      {item.unlocksSkinIds.length > 0 && (
        <>
          <Headline id="skins">Unlocked Skins</Headline>
          <ItemList>
            {item.unlocksSkin.map((skin) => <li key={skin.id}><SkinLink skin={skin}/></li>)}
            {item.unlocksSkinIds.filter((id) => item.unlocksSkin.every((skin) => skin.id !== id)).map((id) => <li key={id}>Unknown skin ({id})</li>)}
          </ItemList>
        </>
      )}

      {item.recipeOutput.length > 0 && (
        <>
          <Headline id="crafted-from">Crafted From</Headline>
          <div style={{ display: 'flex', gap: 16 }}>
            {item.recipeOutput.map((recipe) => (
              <RecipeBox key={recipe.id} recipe={recipe} outputItem={item}/>
            ))}
          </div>
        </>
      )}

      {item.ingredient.length > 0 && (
        <>
          <Headline id="crafting">Used in crafting</Headline>

          <RecipeTable recipes={item.ingredient.map(({ Recipe }) => Recipe)}/>
        </>
      )}

      <Headline id="history">History</Headline>

      <Table>
        <thead>
          <tr><th {...{ width: 1 }}>Build</th><th {...{ width: 1 }}>Language</th><th>Description</th><th {...{ width: 1 }}>Date</th></tr>
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
          <ItemTable items={similarItems}/>
        </>
      )}

      <Headline id="data">Data</Headline>
      <Json data={data}/>

    </DetailLayout>
  );
};

export const getStaticProps = getStaticSuperProps<ItemPageProps>(async ({ params, locale }) => {
  const id: number = Number(params!.id!.toString())!;
  const language = (locale ?? 'en') as Language;

  const [item, revision] = await Promise.all([
    db.item.findUnique({
      where: { id },
      include: {
        history: {
          include: { revision: { select: { id: true, buildId: true, createdAt: true, description: true, language: true }}},
          where: { revision: { language }},
          orderBy: { revision: { createdAt: 'desc' }}
        },
        icon: true,
        unlocksSkin: { include: { icon: true }},
        recipeOutput: { include: { currentRevision: true, itemIngredients: { include: { Item: { include: { icon: true }}}}}},
        ingredient: { include: { Recipe: { include: { currentRevision: true, outputItem: { include: { icon: true }}, itemIngredients: { include: { Item: { include: { icon: true }}}}}}}}
      }
    }),
    db.revision.findFirst({ where: { [`currentItem_${language}`]: { id }}})
  ]);

  if(!item || !revision) {
    return {
      notFound: true
    };
  }

  type t = typeof item['ingredient'];

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
  });

  return {
    props: { item, revision, fixedRevision: false, similarItems },
    revalidate: 600 /* 10 minutes */
  };
});

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: true,
  };
};

export default withSuperProps(ItemPage);
