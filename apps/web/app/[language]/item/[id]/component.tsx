import Link from 'next/link';
import type { Language } from '@gw2treasures/database';
import { ItemTooltip } from '@/components/Item/ItemTooltip';
import DetailLayout from '@/components/Layout/DetailLayout';
import { Table } from '@gw2treasures/ui/components/Table/Table';
import { TableOfContentAnchor } from '@gw2treasures/ui/components/TableOfContent/TableOfContent';
import rarityClasses from '@/components/Layout/RarityColor.module.css';
import { Notice } from '@gw2treasures/ui/components/Notice/Notice';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { FormatDate } from '@/components/Format/FormatDate';
import { ItemList } from '@/components/ItemList/ItemList';
import { ItemInfobox } from '@/components/Item/ItemInfobox';
import { SkinLink } from '@/components/Skin/SkinLink';
import { Json } from '@/components/Format/Json';
import { RecipeBox } from '@/components/Recipe/RecipeBox';
import { ItemIngredientFor } from '@/components/Item/ItemIngredientFor';
import type { AsyncComponent } from '@/lib/asyncComponent';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { SkeletonTable } from '@/components/Skeleton/SkeletonTable';
import { getLinkProperties } from '@/lib/linkProperties';
import { AchievementLink } from '@/components/Achievement/AchievementLink';
import { Tooltip } from '@/components/Tooltip/Tooltip';
import { ItemLinkTooltip } from '@/components/Item/ItemLinkTooltip';
import { Icon } from '@gw2treasures/ui';
import { Tip } from '@gw2treasures/ui/components/Tip/Tip';
import { RemovedFromApiNotice } from '@/components/Notice/RemovedFromApiNotice';
import { RecipeBoxWrapper } from '@/components/Recipe/RecipeBoxWrapper';
import { SimilarItems } from './similar-items';
import { getItem, getRevision } from './data';
import { EditContents } from './_edit-content/EditContents';
import { CurrencyLink } from '@/components/Currency/CurrencyLink';
import { CurrencyValue } from '@/components/Currency/CurrencyValue';
import { compareLocalizedName } from '@/lib/localizedName';
import { ItemTable } from '@/components/ItemTable/ItemTable';
import { ItemTableContext } from '@/components/ItemTable/ItemTableContext';
import { ItemTableColumnsButton } from '@/components/ItemTable/ItemTableColumnsButton';
import { extraColumn, globalColumnDefinitions } from '@/components/ItemTable/columns';
import { ContentChanceColumn, ContentQuantityColumn, ItemContentQuantityColumn } from './ExtraColumns';
import type { TODO } from '@/lib/todo';
import { pageView } from '@/lib/pageView';

export interface ItemPageComponentProps {
  language: Language;
  itemId: number;
  revisionId?: string;
}

export const ItemPageComponent: AsyncComponent<ItemPageComponentProps> = async ({ language, itemId, revisionId }) => {
  // validate itemId
  if(isNaN(itemId)) {
    notFound();
  }

  // load data
  const [item, { revision, data }] = await Promise.all([
    getItem(itemId, language),
    getRevision(itemId, language, revisionId),
    pageView('item', itemId)
  ]);

  // 404 if item doesnt exist
  if(!item || !revision || !data) {
    notFound();
  }

  const fixedRevision = revisionId !== undefined;

  const skinAchievementBits = item.unlocksSkin.flatMap((skin) => skin.achievementBits);

  const showContents = item.type === 'Container' || item._count.contains > 0 || item.containsCurrency.length > 0;
  const canHaveContents = item.type === 'Container' || item.type === 'Consumable';

  const compareByName = compareLocalizedName(language);

  return (
    <DetailLayout
      title={data.name || data.chat_link}
      icon={item.icon}
      className={rarityClasses[data.rarity]}
      breadcrumb={`Item › ${data.type}${data.details ? ` › ${data.details?.type}` : ''}`}
      infobox={<ItemInfobox item={item} data={data} language={language}/>}
      actions={canHaveContents ? [<EditContents key="edit-content" appearance="menu" contents={item.contains} currencyContents={item.containsCurrency} itemId={item.id}/>] : undefined}
    >
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

      {item._count.suffixIn > 0 && (
        <ItemTableContext id="suffixIn">
          <Headline id="upgrade" actions={<ItemTableColumnsButton/>}>Upgrade in</Headline>
          <ItemTable query={{ where: { suffixItems: { some: { id: item.id }}}}}/>
        </ItemTableContext>
      )}

      {(item.achievementBits.length > 0 || item.achievementRewards.length > 0 || skinAchievementBits.length > 0) && (<Headline id="achievements">Achievements</Headline>)}

      {item.achievementBits.length > 0 && (
        <>
          <p>Required to complete the following achievements:</p>
          <ItemList>
            {item.achievementBits.sort(compareByName).map((achievement) => <li key={achievement.id}><AchievementLink achievement={achievement}/></li>)}
          </ItemList>
        </>
      )}

      {item.achievementRewards.length > 0 && (
        <>
          <p>Rewarded for completing the following achievements:</p>
          <ItemList>
            {item.achievementRewards.sort(compareByName).map((achievement) => <li key={achievement.id}><AchievementLink achievement={achievement}/></li>)}
          </ItemList>
        </>
      )}

      {skinAchievementBits.length > 0 && (
        <>
          <p>The skin unlocked by this item is required to complete the following achievements:</p>
          <ItemList>
            {skinAchievementBits.sort(compareByName).map((achievement) => <li key={achievement.id}><AchievementLink achievement={achievement}/></li>)}
          </ItemList>
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

      {!fixedRevision && item._count.containedIn > 0 && (
        <ItemTableContext id="containedIn">
          <Headline id="contained" actions={<ItemTableColumnsButton/>}>Contained In</Headline>
          <ItemTable query={{ model: 'content', mapToItem: 'containerItem', where: { contentItemId: item.id }}}
            extraColumns={[
              extraColumn<'content'>({ id: 'quantity', select: { quantity: true }, title: 'Quantity', component: ContentQuantityColumn as TODO, order: 71 }),
              extraColumn<'content'>({ id: 'chance', select: { chance: true }, title: 'Chance', component: ContentChanceColumn as TODO, order: 72 })
            ]}
            defaultColumns={['item', 'quantity', 'chance', 'level', 'rarity', 'type', 'vendorValue']}/>
        </ItemTableContext>
      )}

      {item._count && item._count?.ingredient > 0 && (
        <Suspense fallback={(
          <>
            <Headline id="crafting">Used in crafting</Headline>
            <SkeletonTable columns={['Output', 'Rating', 'Disciplines', 'Ingredients']} rows={item._count?.ingredient}/>
          </>
        )}
        >
          <ItemIngredientFor itemId={item.id}/>
        </Suspense>
      )}

      {!fixedRevision && showContents && (
        <ItemTableContext id="contents">
          <Headline id="content" actions={[
            <EditContents key="edit" itemId={itemId} contents={item.contains} currencyContents={item.containsCurrency}/>,
            item._count.contains > 0 && <ItemTableColumnsButton key="columns"/>
          ]}
          >
            Contents
          </Headline>

          {item.containsCurrency.length > 0 && (
            <ItemList>
              {item.containsCurrency.map((contained) => (
                <li key={contained.currencyId}>
                  <span style={{ display: 'flex', flex: 1, alignItems: 'center', gap: 8 }}>
                    <CurrencyLink currency={contained.currency}/>
                    <span>
                      ({contained.min === contained.max
                        ? <CurrencyValue currencyId={contained.currencyId} value={contained.min}/>
                        : <><CurrencyValue currencyId={contained.currencyId} value={contained.min}/> – <CurrencyValue currencyId={contained.currencyId} value={contained.max}/></>
                      })
                    </span>
                  </span>
                </li>
              ))}
            </ItemList>
          )}

          {item._count.contains > 0 && (
            <ItemTable
              query={{ model: 'content', mapToItem: 'contentItem', where: { containerItemId: item.id }}}
              extraColumns={[
                extraColumn<'content'>({ id: 'item', select: { quantity: true, contentItem: { select: globalColumnDefinitions.item.select }}, title: 'Item (Qty)', component: ItemContentQuantityColumn as TODO, order: 21 }),
                extraColumn<'content'>({ id: 'quantity', select: { quantity: true }, title: 'Quantity', component: ContentQuantityColumn as TODO, order: 71, orderBy: [{ quantity: 'asc' }, { quantity: 'desc' }] }),
                extraColumn<'content'>({ id: 'chance', select: { chance: true }, title: 'Chance', component: ContentChanceColumn as TODO, order: 72 })
              ]}
              defaultColumns={['item', 'chance', 'level', 'rarity', 'type', 'vendorValue']}/>
          )}

          {item._count.contains === 0 && item.containsCurrency.length === 0 && (
            <p>The contents of this container are unknown. You can help by adding the contained items.</p>
          )}
        </ItemTableContext>
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
              <td><FormatDate date={history.revision.createdAt} relative/></td>
              <td>{history.revisionId !== revision.id && <Link href={`/item/${item.id}/${history.revisionId}`}>View</Link>}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {!fixedRevision && (
        <Suspense>
          <SimilarItems item={item}/>
        </Suspense>
      )}

      <Headline id="data">Data</Headline>
      <Json data={data}/>

    </DetailLayout>
  );
};
