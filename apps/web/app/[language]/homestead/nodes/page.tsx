import { Trans } from '@/components/I18n/Trans';
import homeNodes from '@gw2efficiency/game-data/home/nodes';
import { createDataTable } from '@gw2treasures/ui/components/Table/DataTable';
import { linkProperties } from '@/lib/linkProperties';
import { db } from '@/lib/prisma';
import { ItemLink } from '@/components/Item/ItemLink';
import { ColumnSelect } from '@/components/Table/ColumnSelect';
import { groupById } from '@gw2treasures/helper/group-by';
import { cache } from '@/lib/cache';
import { Gw2AccountBodyCells, Gw2AccountHeaderCells } from '@/components/Gw2Api/Gw2AccountTableCells';
import { AccountHomeNodeCell, requiredScopes } from '../homestead.client';
import { globalColumnRenderer as itemTableColumn } from '@/components/ItemTable/columns';
import { PageView } from '@/components/PageView/PageView';
import { Description } from '@/components/Layout/Description';
import { getTranslate } from '@/lib/translate';
import type { PageProps } from '@/lib/next';
import { Gw2Accounts } from '@/components/Gw2Api/Gw2Accounts';
import { Scope } from '@gw2me/client';
import { isDefined } from '@gw2treasures/helper/is';
import { FlexRow } from '@gw2treasures/ui/components/Layout/FlexRow';
import { createMetadata } from '@/lib/metadata';

const getItems = cache(
  async (ids: number[]) => {
    const items = await db.item.findMany({
      where: { id: { in: ids }},
      select: {
        ...linkProperties,
        tpTradeable: true, tpCheckedAt: true,
        buyPrice: true, buyQuantity: true,
        sellPrice: true, sellQuantity: true,
        tpHistory: { orderBy: { time: 'asc' }}
      }
    });

    return Object.fromEntries(groupById(items).entries());
  }, ['homestead-items'], { revalidate: 60 * 5 }
);

export default async function HomesteadNodesPage({ params }: PageProps) {
  const { language } = await params;

  // collect all the item ids
  const itemIds = homeNodes.reduce<number[]>(
    (ids, node) => [...ids, ...node.unlock_items, ...(node.gathered_items ?? [])],
    []
  );

  // get items from db that unlock some node
  const items = await getItems(itemIds);

  // add the item to each node
  const nodes = homeNodes.map((node) => ({
    ...node,
    item: items[node.unlock_items[0]],
    gatheredItems: node.gathered_items?.map((id) => items[id]).filter(isDefined)
  }));

  // create data-table
  const HomeNode = createDataTable(nodes, ({ id }) => id);

  return (
    <>
      <Gw2Accounts requiredScopes={[Scope.GW2_Progression, Scope.GW2_Unlocks]} authorizationMessage="Authorize gw2treasures.com to view your homestead progression." loading={null}/>

      <Description actions={<ColumnSelect table={HomeNode}/>}>
        <Trans id="homestead.nodes.description"/>
      </Description>

      <HomeNode.Table>
        <HomeNode.Column id="id" title={<Trans id="itemTable.column.id"/>} sortBy="id" small hidden>{({ id }) => id}</HomeNode.Column>
        <HomeNode.Column id="node" title="Node" sortBy="name">{({ item, name }) => item ? <ItemLink item={item}/> : name}</HomeNode.Column>
        <HomeNode.Column id="gathered" title="Gathered Items">{({ gatheredItems }) => <FlexRow>{gatheredItems?.map((item) => <ItemLink key={item.id} item={item}>{null}</ItemLink>)}</FlexRow>}</HomeNode.Column>
        <HomeNode.Column id="buyPrice" title={<Trans id="itemTable.column.buyPrice"/>} sortBy={({ item }) => item.buyPrice} align="right">{({ item }) => itemTableColumn.buyPrice(item, {}, language)}</HomeNode.Column>
        <HomeNode.Column id="buyPriceTrend" title={<Trans id="itemTable.column.buyPriceTrend"/>} align="right">{({ item }) => itemTableColumn.buyPriceTrend(item, {}, language)}</HomeNode.Column>
        <HomeNode.Column id="buyQuantity" title={<Trans id="itemTable.column.buyQuantity"/>} sortBy={({ item }) => item.buyQuantity} align="right" hidden>{({ item }) => itemTableColumn.buyQuantity(item, {}, language)}</HomeNode.Column>
        <HomeNode.Column id="sellPrice" title={<Trans id="itemTable.column.sellPrice"/>} sortBy={({ item }) => item.sellPrice} align="right" hidden>{({ item }) => itemTableColumn.sellPrice(item, {}, language)}</HomeNode.Column>
        <HomeNode.Column id="sellPriceTrend" title={<Trans id="itemTable.column.sellPriceTrend"/>} align="right" hidden>{({ item }) => itemTableColumn.sellPriceTrend(item, {}, language)}</HomeNode.Column>
        <HomeNode.Column id="sellQuantity" title={<Trans id="itemTable.column.sellQuantity"/>} sortBy={({ item }) => item.sellQuantity} align="right" hidden>{({ item }) => itemTableColumn.sellQuantity(item, {}, language)}</HomeNode.Column>
        <HomeNode.DynamicColumns id="account-unlock" title="Account Unlocks" headers={<Gw2AccountHeaderCells requiredScopes={requiredScopes} small/>}>
          {({ id }) => <Gw2AccountBodyCells requiredScopes={requiredScopes}><AccountHomeNodeCell nodeId={id} accountId={undefined as never}/></Gw2AccountBodyCells>}
        </HomeNode.DynamicColumns>
      </HomeNode.Table>

      <PageView page="homestead/nodes"/>
    </>
  );
}

export const generateMetadata = createMetadata(async ({ params }) => {
  const { language } = await params;
  const t = getTranslate(language);

  return {
    title: t('homestead.nodes'),
    description: t('homestead.nodes.description'),
  };
});
