import Link from 'next/link';
import { Language } from '@prisma/client';
import { ItemTooltip } from '@/components/Item/ItemTooltip';
import DetailLayout from '@/components/Layout/DetailLayout';
import { Table } from '@/components/Table/Table';
import { TableOfContentAnchor } from '@/components/TableOfContent/TableOfContent';
import { Gw2Api } from 'gw2-api-types';
import { db } from '@/lib/prisma';
import rarityClasses from '@/components/Layout/RarityColor.module.css';
import { Notice } from '@/components/Notice/Notice';
import { getIconUrl } from '@/lib/getIconUrl';
import { Headline } from '@/components/Headline/Headline';
import { FormatDate } from '@/components/Format/FormatDate';
import { ItemList } from '@/components/ItemList/ItemList';
import { ItemInfobox } from '@/components/Item/ItemInfobox';
import { SkinLink } from '@/components/Skin/SkinLink';
import { Json } from '@/components/Format/Json';
import { ItemTable } from '@/components/Item/ItemTable';
import { RecipeBox } from '@/components/Recipe/RecipeBox';
import { ItemIngredientFor } from '@/components/Item/ItemIngredientFor';
import { AsyncComponent } from '@/lib/asyncComponent';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { SkeletonTable } from '@/components/Skeleton/SkeletonTable';
import { remember } from '@/lib/remember';
import { linkProperties, linkPropertiesWithoutRarity } from '@/lib/linkProperties';
import { AchievementLink } from '@/components/Achievement/AchievementLink';

export interface ItemPageComponentProps {
  language: Language;
  itemId: number;
  revisionId?: string;
}

const getItem = remember(60, async function getItem(id: number, language: Language, revisionId?: string) {
  if(isNaN(id)) {
    notFound();
  }

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
        unlocksSkin: { select: { ...linkProperties, weight: true, type: true, subtype: true, achievementBits: { select: linkPropertiesWithoutRarity }}},
        recipeOutput: { include: { currentRevision: true, itemIngredients: { include: { Item: { include: { icon: true }}}}}},
        achievementBits: { select: linkPropertiesWithoutRarity, orderBy: { id: 'asc' }},
        achievementRewards: { select: linkPropertiesWithoutRarity, orderBy: { id: 'asc' }},
        _count: {
          select: { ingredient: true }
        }
      }
    }),
    revisionId
      ? db.revision.findUnique({ where: { id: revisionId }})
      : db.revision.findFirst({ where: { [`currentItem_${language}`]: { id }}})
  ]);

  if(!item || !revision) {
    notFound();
  }

  const similarItems = revisionId ? [] : await db.item.findMany({
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

  return { item, revision, similarItems };
});

export const ItemPageComponent: AsyncComponent<ItemPageComponentProps> = async ({ language, itemId, revisionId }) => {
  const fixedRevision = revisionId !== undefined;
  const { item, revision, similarItems } = await getItem(itemId, language, revisionId);

  const data: Gw2Api.Item = JSON.parse(revision.data);

  const skinAchievementBits = item.unlocksSkin.flatMap((skin) => skin.achievementBits);

  return (
    <DetailLayout title={data.name || data.chat_link} icon={item.icon && getIconUrl(item.icon, 64) || undefined} className={rarityClasses[data.rarity]} breadcrumb={`Item › ${data.type}${data.details ? ` › ${data.details?.type}` : ''}`} infobox={<ItemInfobox item={item} data={data} language={language}/>}>
      {item[`currentId_${language}`] !== revision.id && (
        <Notice icon="revision">You are viewing an old revision of this item (Build {revision.buildId || 'unknown'}). <Link href={`/item/${item.id}`}>View current.</Link></Notice>
      )}
      {item[`currentId_${language}`] === revision.id && fixedRevision && (
        <Notice icon="revision">You are viewing this item at a fixed revision (Build {revision.buildId || 'unknown'}). <Link href={`/item/${item.id}`}>View current.</Link></Notice>
      )}
      {!fixedRevision && item.removedFromApi && (
        <Notice type="warning" icon="revision">This item is currently not available in the Guild Wars 2 Api and you are seeing the last know version. The item has either been removed from the game or needs to be rediscovered.</Notice>
      )}

      <TableOfContentAnchor id="tooltip">Tooltip</TableOfContentAnchor>
      <ItemTooltip item={data}/>

      {item.unlocksSkinIds.length > 0 && (
        <>
          <Headline id="skins">Unlocked Skins</Headline>
          <ItemList>
            {item.unlocksSkin.map((skin) => <li key={skin.id}><SkinLink skin={skin}/> {skin.weight} {skin.subtype ?? skin.type}</li>)}
            {item.unlocksSkinIds.filter((id) => item.unlocksSkin.every((skin) => skin.id !== id)).map((id) => <li key={id}>Unknown skin ({id})</li>)}
          </ItemList>
        </>
      )}

      {(item.achievementBits.length > 0 || item.achievementRewards.length > 0 || skinAchievementBits.length > 0) && (<Headline id="achievements">Achievements</Headline>)}

      {item.achievementBits.length > 0 && (
        <>
          <p>Required to complete the following achievements:</p>
          <ItemList>
            {item.achievementBits.map((achievement) => <li key={achievement.id}><AchievementLink achievement={achievement}/></li>)}
          </ItemList>
        </>
      )}

      {item.achievementRewards.length > 0 && (
        <>
          <p>Rewarded for completing the following achievements:</p>
          <ItemList>
            {item.achievementRewards.map((achievement) => <li key={achievement.id}><AchievementLink achievement={achievement}/></li>)}
          </ItemList>
        </>
      )}

      {skinAchievementBits.length > 0 && (
        <>
          <p>The skin unlocked by this item is required to complete the following achievements:</p>
          <ItemList>
            {skinAchievementBits.map((achievement) => <li key={achievement.id}><AchievementLink achievement={achievement}/></li>)}
          </ItemList>
        </>
      )}

      {item.recipeOutput && item.recipeOutput.length > 0 && (
        <>
          <Headline id="crafted-from">Crafted From</Headline>
          <div style={{ display: 'flex', gap: 16 }}>
            {item.recipeOutput.map((recipe) => (
              <RecipeBox key={recipe.id} recipe={recipe} outputItem={item}/>
            ))}
          </div>
        </>
      )}

      {item._count && item._count?.ingredient > 0 && (
        <Suspense fallback={(
          <>
            <Headline id="crafting">Used in crafting</Headline>
            <SkeletonTable columns={['Output', 'Rating', 'Disciplines', 'Ingredients']} rows={item._count?.ingredient}/>
          </>
        )}
        >
          {/* @ts-expect-error Server Component */}
          <ItemIngredientFor itemId={item.id}/>
        </Suspense>
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
              <td><FormatDate date={history.revision.createdAt} relative data-superjson/></td>
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
