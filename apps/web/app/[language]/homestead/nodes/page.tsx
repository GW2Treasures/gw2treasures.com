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


const getItems = cache(
  async (ids: number[]) => {
    const items = await db.item.findMany({
      where: { id: { in: ids }},
      select: {
        ...linkProperties,
        tpTradeable: true, tpCheckedAt: true,
        buyPrice: true, buyQuantity: true,
        sellPrice: true, sellQuantity: true
      }
    });

    return Object.fromEntries(groupById(items).entries());
  }, ['homestead-items'], { revalidate: 60 * 5 }
);

export default async function HomesteadNodesPage() {
  // get item ids that unlock some node
  const nodeUnlockItemIds = homeNodes.reduce<number[]>(
    (ids, node) => [...ids, ...node.unlock_items],
    []
  );

  // get items from db that unlock some node
  const unlockItems = await getItems(nodeUnlockItemIds);

  // add the item to each node
  const nodes = homeNodes.map((node) => ({
    ...node,
    item: unlockItems[node.unlock_items[0]]
  }));

  // create data-table
  const HomeNode = createDataTable(nodes, ({ id }) => id);

  return (
    <>
      <Description actions={<ColumnSelect table={HomeNode}/>}>
        <Trans id="homestead.nodes.description"/>
      </Description>

      <HomeNode.Table>
        <HomeNode.Column id="id" title="Id" small hidden>{({ id }) => id}</HomeNode.Column>
        <HomeNode.Column id="node" title="Node" sortBy="name">{({ item, name }) => item ? <ItemLink item={item}/> : name}</HomeNode.Column>
        <HomeNode.Column id="buyPrice" title="Buy Price" sortBy={({ item }) => item.buyPrice} align="right">{({ item }) => itemTableColumn.buyPrice(item, {})}</HomeNode.Column>
        <HomeNode.Column id="buyQuantity" title="Buy Quantity" sortBy={({ item }) => item.buyQuantity} align="right" hidden>{({ item }) => itemTableColumn.buyQuantity(item, {})}</HomeNode.Column>
        <HomeNode.Column id="sellPrice" title="Sell Price" sortBy={({ item }) => item.sellPrice} align="right" hidden>{({ item }) => itemTableColumn.sellPrice(item, {})}</HomeNode.Column>
        <HomeNode.Column id="sellQuantity" title="Buy Quantity" sortBy={({ item }) => item.sellQuantity} align="right" hidden>{({ item }) => itemTableColumn.sellQuantity(item, {})}</HomeNode.Column>
        <HomeNode.DynamicColumns headers={<Gw2AccountHeaderCells requiredScopes={requiredScopes} small/>}>
          {({ id }) => <Gw2AccountBodyCells requiredScopes={requiredScopes}><AccountHomeNodeCell nodeId={id} accountId={undefined as never}/></Gw2AccountBodyCells>}
        </HomeNode.DynamicColumns>
      </HomeNode.Table>

      <PageView page="homestead/nodes"/>
    </>
  );
}

export const metadata = {
  title: 'Homestead Nodes'
};
