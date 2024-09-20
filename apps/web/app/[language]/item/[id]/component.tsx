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
import { Json } from '@/components/Format/Json';
import { RecipeBox } from '@/components/Recipe/RecipeBox';
import { ItemIngredientFor } from '@/components/Item/ItemIngredientFor';
import { notFound } from 'next/navigation';
import { Suspense, type FC } from 'react';
import { SkeletonTable } from '@/components/Skeleton/SkeletonTable';
import { getLinkProperties } from '@/lib/linkProperties';
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
import { ItemTable } from '@/components/ItemTable/ItemTable';
import { ItemTableContext } from '@/components/ItemTable/ItemTableContext';
import { ItemTableColumnsButton } from '@/components/ItemTable/ItemTableColumnsButton';
import { extraColumn, globalColumnDefinitions } from '@/components/ItemTable/columns';
import { ContentChanceColumn, ContentQuantityColumn, ItemContentQuantityColumn } from './ExtraColumns';
import type { TODO } from '@/lib/todo';
import { pageView } from '@/lib/pageView';
import { GuildUpgradeLink } from '@/components/GuildUpgrade/GuildUpgradeLink';
import { TradingPostHistory } from './trading-post-history';
import { parseIcon } from '@/lib/parseIcon';
import { getTranslate, type TranslationId } from '@/lib/translate';
import { ItemLink } from '@/components/Item/ItemLink';
import { OutputCount } from '@/components/Item/OutputCount';
import { AstralAcclaim } from '@/components/Format/AstralAcclaim';
import { Breadcrumb, BreadcrumbItem } from '@/components/Breadcrumb/Breadcrumb';
import { MysticForgeRecipeBox } from '@/components/Recipe/MysticForgeRecipeBox';
import { MysticForgeRecipeTable } from '@/components/Recipe/MysticForgeRecipeTable';
import { LinkButton } from '@gw2treasures/ui/components/Form/Button';
import { SkinTable } from '@/components/Skin/SkinTable';
import { ItemInventoryTable } from '@/components/Item/ItemInventoryTable';
import { AchievementTable } from '@/components/Achievement/AchievementTable';
import { Description } from '@/components/Layout/Description';

export interface ItemPageComponentProps {
  language: Language;
  itemId: number;
  revisionId?: string;
}

export const ItemPageComponent: FC<ItemPageComponentProps> = async ({ language, itemId, revisionId }) => {
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

  const hasSkinUnlocks = item.unlocksSkinIds.length > 0;
  const unknownSkinIds = item.unlocksSkinIds.filter((id) => item.unlocksSkin.every((skin) => skin.id !== id));

  const icon = parseIcon(data.icon);

  const t = getTranslate(language);

  return (
    <DetailLayout
      title={data.name || data.chat_link}
      icon={icon?.id === item.icon?.id ? item.icon : (icon ? { ...icon, color: null } : null)}
      className={rarityClasses[data.rarity]}
      breadcrumb={(
        <Breadcrumb>
          <BreadcrumbItem name={t('navigation.items')} href="/item"/>
          <BreadcrumbItem name={t(`item.type.${data.type}`)}/>
          {data.details?.type && <BreadcrumbItem name={t(`item.type.${data.type}.${data.details.type}` as TranslationId)}/>}
        </Breadcrumb>
      )}
      infobox={<ItemInfobox item={item} data={data} language={language}/>}
      actions={[
        canHaveContents ? <EditContents key="edit-content" appearance="menu" contents={item.contains} currencyContents={item.containsCurrency} itemId={item.id}/> : undefined,
        <LinkButton key="mf" appearance="menu" icon="mystic-forge" href={`/item/${item.id}/edit-mystic-forge`}>Add Mystic Forge Recipe</LinkButton>
      ]}
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
      <ItemTooltip item={data} language={language} hideTitle/>

      <Headline id="inventory">Inventories</Headline>
      <ItemInventoryTable itemId={itemId}/>

      {hasSkinUnlocks && (
        <>
          <SkinTable skins={item.unlocksSkin} headline="Unlocked Skins" headlineId="skins"/>

          {unknownSkinIds.length > 0 && (
            <ItemList>
              {unknownSkinIds.map((id) => <li key={id}>Unknown skin ({id})</li>)}
            </ItemList>
          )}
        </>
      )}

      {item.unlocksGuildUpgrade.length > 0 && (
        <>
          <Headline id="guild-upgrades">Unlocked Guild Upgrades</Headline>
          <ItemList>
            {item.unlocksGuildUpgrade.map((guildUpgrade) => <li key={guildUpgrade.id}><GuildUpgradeLink guildUpgrade={guildUpgrade}/></li>)}
          </ItemList>
        </>
      )}

      {item._count.suffixIn > 0 && (
        <ItemTableContext id="suffixIn">
          <Headline id="upgrade" actions={<ItemTableColumnsButton/>}>Upgrade in</Headline>
          <ItemTable query={{ where: { suffixItems: { some: { id: item.id }}}}} defaultColumns={['item', 'level', 'rarity', 'type', 'vendorValue', 'sellPrice']}/>
        </ItemTableContext>
      )}

      {(item.achievementBits.length > 0 || item.achievementRewards.length > 0 || skinAchievementBits.length > 0) && (<Headline id="achievements">Achievements</Headline>)}

      {item.achievementBits.length > 0 && (
        <AchievementTable language={language} achievements={item.achievementBits}>
          {(table, columnSelect) => (
            <>
              <Description actions={columnSelect}>
                Required to complete these achievements:
              </Description>
              {table}
            </>
          )}
        </AchievementTable>
      )}

      {item.achievementRewards.length > 0 && (
        <AchievementTable language={language} achievements={item.achievementRewards}>
          {(table, columnSelect) => (
            <>
              <Description actions={columnSelect}>
                Rewarded for completing these achievements:
              </Description>
              {table}
            </>
          )}
        </AchievementTable>
      )}

      {skinAchievementBits.length > 0 && (
        <AchievementTable language={language} achievements={skinAchievementBits}>
          {(table, columnSelect) => (
            <>
              <Description actions={columnSelect}>
                The skin unlocked by this item is required to complete these achievements:
              </Description>
              {table}
            </>
          )}
        </AchievementTable>
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

      {(item.recipeOutput.length > 0 || item.mysticForgeRecipeOutput.length > 0) && (
        <>
          <Headline id="crafted-from">Crafted From</Headline>
          <RecipeBoxWrapper>
            {item.recipeOutput.map((recipe) => (
              <RecipeBox key={recipe.id} recipe={recipe} outputItem={item}/>
            ))}
            {item.mysticForgeRecipeOutput.map((recipe) => (
              <MysticForgeRecipeBox key={recipe.id} recipe={recipe} outputItem={item}/>
            ))}
          </RecipeBoxWrapper>
        </>
      )}

      {item.wizardsVaultListings.length > 0 && (
        <>
          <Headline id="wizards-vault">Wizard&apos;s Vault</Headline>
          <p>This item is available in the <Link href="/wizards-vault">Wizard&apos;s Vault</Link>.</p>
          <Table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Type</th>
                <th align="right">Purchase Limit</th>
                <th align="right">Cost</th>
              </tr>
            </thead>
            <tbody>
              {item.wizardsVaultListings.map((listing) => (
                <tr key={listing.id}>
                  <td><OutputCount count={listing.count}><ItemLink item={item}/></OutputCount></td>
                  <td>{listing.type}</td>
                  <td align="right">{listing.limit}</td>
                  <td align="right"><AstralAcclaim value={listing.cost}/></td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}

      {!fixedRevision && item._count.containedIn > 0 && (
        <ItemTableContext id="containedIn">
          <Headline id="contained" actions={<ItemTableColumnsButton/>}>Contained In</Headline>
          <ItemTable query={{ model: 'content', mapToItem: 'containerItem', where: { contentItemId: item.id }}}
            extraColumns={[
              extraColumn<'content'>({ id: 'quantity', select: { quantity: true }, title: t('container.quantity'), component: ContentQuantityColumn as TODO, order: 71, align: 'right', small: true, orderBy: [{ quantity: 'asc' }, { quantity: 'desc' }] }),
              extraColumn<'content'>({ id: 'chance', select: { chance: true }, title: t('container.chance'), component: ContentChanceColumn as TODO, order: 72, orderBy: [{ chance: 'asc' }, { chance: 'desc' }] })
            ]}
            defaultColumns={['item', 'quantity', 'chance', 'level', 'rarity', 'type', 'vendorValue', 'sellPrice']}/>
        </ItemTableContext>
      )}

      {item._count.ingredient > 0 && (
        <Suspense fallback={(
          <>
            <Headline id="crafting">Used in Crafting</Headline>
            <SkeletonTable columns={['Output', 'Rating', 'Disciplines', 'Ingredients']} rows={item._count.ingredient}/>
          </>
        )}
        >
          <ItemIngredientFor itemId={item.id}/>
        </Suspense>
      )}

      {item._count.mysticForgeIngredient > 0 && (
        <MysticForgeRecipeTable ingredientItemId={item.id}/>
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
                extraColumn<'content'>({ id: 'item', select: { quantity: true, contentItem: { select: globalColumnDefinitions.item.select }}, title: `${t('itemTable.column.item')} (${t('container.quantity')})`, component: ItemContentQuantityColumn as TODO, order: 21 }),
                extraColumn<'content'>({ id: 'quantity', select: { quantity: true }, title: t('container.quantity'), component: ContentQuantityColumn as TODO, order: 71, small: true, orderBy: [{ quantity: 'asc' }, { quantity: 'desc' }] }),
                extraColumn<'content'>({ id: 'chance', select: { chance: true }, title: t('container.chance'), component: ContentChanceColumn as TODO, order: 72, orderBy: [{ chance: 'asc' }, { chance: 'desc' }] })
              ]}
              defaultColumns={['item', 'chance', 'level', 'rarity', 'type', 'vendorValue', 'sellPrice']}/>
          )}

          {item._count.contains === 0 && item.containsCurrency.length === 0 && (
            <p>The contents of this container are unknown. You can help by adding the contained items.</p>
          )}
        </ItemTableContext>
      )}

      {item.tpTradeable && !fixedRevision && (
        <TradingPostHistory itemId={item.id}/>
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
