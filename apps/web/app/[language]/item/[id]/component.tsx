import Link from 'next/link';
import { Language } from '@gw2treasures/database';
import { ItemTooltip } from '@/components/Item/ItemTooltip';
import DetailLayout from '@/components/Layout/DetailLayout';
import { Table } from '@/components/Table/Table';
import { TableOfContentAnchor } from '@/components/TableOfContent/TableOfContent';
import { Gw2Api } from 'gw2-api-types';
import { db } from '@/lib/prisma';
import rarityClasses from '@/components/Layout/RarityColor.module.css';
import { Notice } from '@/components/Notice/Notice';
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
import { getLinkProperties, linkProperties, linkPropertiesWithoutRarity } from '@/lib/linkProperties';
import { AchievementLink } from '@/components/Achievement/AchievementLink';
import { Tooltip } from '@/components/Tooltip/Tooltip';
import { ItemLinkTooltip } from '@/components/Item/ItemLinkTooltip';
import Icon from 'icons/Icon';
import { Tip } from '@/components/Tip/Tip';
import { RemovedFromApiNotice } from '@/components/Notice/RemovedFromApiNotice';
import { RecipeBoxWrapper } from '@/components/Recipe/RecipeBoxWrapper';
import { SimilarItems } from './similar-items';

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
        recipeOutput: { include: { currentRevision: true, itemIngredients: { include: { Item: { select: linkProperties }}}, unlockedByItems: { select: linkProperties }}},
        unlocksRecipe: { include: { currentRevision: true, itemIngredients: { include: { Item: { select: linkProperties }}}, unlockedByItems: { select: linkProperties }, outputItem: { select: linkProperties }}},
        achievementBits: { select: linkPropertiesWithoutRarity, orderBy: { id: 'asc' }},
        achievementRewards: { select: linkPropertiesWithoutRarity, orderBy: { id: 'asc' }},
        suffixIn: { include: { icon: true }},
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

  return { item, revision };
});

export const ItemPageComponent: AsyncComponent<ItemPageComponentProps> = async ({ language, itemId, revisionId }) => {
  const fixedRevision = revisionId !== undefined;
  const { item, revision } = await getItem(itemId, language, revisionId);

  const data: Gw2Api.Item = JSON.parse(revision.data);

  const skinAchievementBits = item.unlocksSkin.flatMap((skin) => skin.achievementBits);

  return (
    <DetailLayout title={data.name || data.chat_link} icon={item.icon} className={rarityClasses[data.rarity]} breadcrumb={`Item › ${data.type}${data.details ? ` › ${data.details?.type}` : ''}`} infobox={<ItemInfobox item={item} data={data} language={language}/>}>
      {item[`currentId_${language}`] !== revision.id && (
        <Notice icon="revision">You are viewing an old revision of this item{revision.buildId !== 0 && (<> (<Link href={`/build/${revision.buildId}`}>Build {revision.buildId}</Link>)</>)}. Some data is only available when viewing the latest version. <Link href={`/item/${item.id}`}>View latest</Link>.</Notice>
      )}
      {item[`currentId_${language}`] === revision.id && fixedRevision && (
        <Notice icon="revision">You are viewing this item at a fixed revision{revision.buildId !== 0 && (<> (<Link href={`/build/${revision.buildId}`}>Build {revision.buildId}</Link>)</>)}. Some data is only available when viewing the latest version. <Link href={`/item/${item.id}`}>View latest</Link>.</Notice>
      )}
      {!fixedRevision && item.removedFromApi && (
        <RemovedFromApiNotice type="item"/>
      )}

      <TableOfContentAnchor id="tooltip">Tooltip</TableOfContentAnchor>
      {/* @ts-expect-error Server Component */}
      <ItemTooltip item={data} language={language}/>

      {item.unlocksSkinIds.length > 0 && (
        <>
          <Headline id="skins">Unlocked Skins</Headline>
          <ItemList>
            {item.unlocksSkin.map((skin) => <li key={skin.id}><SkinLink skin={skin}/> {skin.weight} {skin.subtype ?? skin.type}</li>)}
            {item.unlocksSkinIds.filter((id) => item.unlocksSkin.every((skin) => skin.id !== id)).map((id) => <li key={id}>Unknown skin ({id})</li>)}
          </ItemList>
        </>
      )}

      {item.suffixIn.length > 0 && (
        <>
          <Headline id="upgrade">Upgrade in</Headline>
          <ItemTable items={item.suffixIn}/>
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
          <RecipeBoxWrapper>
            {item.recipeOutput.map((recipe) => (
              <RecipeBox key={recipe.id} recipe={recipe} outputItem={item}/>
            ))}
          </RecipeBoxWrapper>
        </>
      )}

      {item.unlocksRecipe && item.unlocksRecipe.length > 0 && (
        <>
          <Headline id="unlocks-recipe">Unlocks Recipe</Headline>
          <RecipeBoxWrapper>
            {item.unlocksRecipe.map((recipe) => (
              <RecipeBox key={recipe.id} recipe={recipe} outputItem={recipe.outputItem}/>
            ))}
          </RecipeBoxWrapper>
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
          <tr>
            <Table.HeaderCell small/>
            <Table.HeaderCell small>Build</Table.HeaderCell>
            <Table.HeaderCell>Description</Table.HeaderCell>
            <Table.HeaderCell small>Date</Table.HeaderCell>
            <Table.HeaderCell small>Actions</Table.HeaderCell>
          </tr>
        </thead>
        <tbody>
          {item.history.map((history) => (
            <tr key={history.revisionId}>
              <td style={{ paddingRight: 0 }}>{history.revisionId === revision.id && <Tip tip="Currently viewing"><Icon icon="eye"/></Tip>}</td>
              <td>{history.revision.buildId !== 0 ? (<Link href={`/build/${history.revision.buildId}`}>{history.revision.buildId}</Link>) : '-'}</td>
              <td>
                <Tooltip content={<ItemLinkTooltip item={getLinkProperties(item)} language={language} revision={history.revisionId}/>}>
                  <Link href={`/item/${item.id}/${history.revisionId}`}>
                    {history.revision.description}
                  </Link>
                </Tooltip>
              </td>
              <td><FormatDate date={history.revision.createdAt} relative data-superjson/></td>
              <td>{history.revisionId !== revision.id && <Link href={`/item/${item.id}/${history.revisionId}`}>View</Link>}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {!fixedRevision && (
        <Suspense>
          {/* @ts-expect-error Server Component */}
          <SimilarItems item={item}/>
        </Suspense>
      )}

      <Headline id="data">Data</Headline>
      <Json data={data}/>

    </DetailLayout>
  );
};
