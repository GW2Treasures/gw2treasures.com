import { Trans } from '@/components/I18n/Trans';
import { ItemLink } from '@/components/Item/ItemLink';
import { globalColumnRenderer as itemTableColumn } from '@/components/ItemTable/columns';
import { Description } from '@/components/Layout/Description';
import { PageView } from '@/components/PageView/PageView';
import { ColumnSelect } from '@/components/Table/ColumnSelect';
import { cache } from '@/lib/cache';
import { linkProperties } from '@/lib/linkProperties';
import { db } from '@/lib/prisma';
import { groupById } from '@gw2treasures/helper/group-by';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import {
  createDataTable,
  type DataTableColumnProps,
  type DataTableColumnSelectionProps,
  type DataTableDynamicColumnsProps,
  type DataTableProps,
} from '@gw2treasures/ui/components/Table/DataTable';
import type { FC } from 'react';
import {
  fiber,
  FIBER_ID,
  metal,
  METAL_ID,
  wood,
  WOOD_ID,
  type ConversionRate,
  type RefinedCosts,
  type RefinedSources,
} from './data';

const getItems = cache(
  async (ids: number[]) => {
    const items = await db.item.findMany({
      where: { id: { in: ids }},
      select: {
        ...linkProperties,
        tpTradeable: true,
        tpCheckedAt: true,
        buyPrice: true,
        sellPrice: true,
      },
    });

    return Object.fromEntries(groupById(items).entries());
  },
  ['homestead-refined-mats'],
  { revalidate: 60 * 5 }
);

export default async function RefinedMaterialsPage() {
  const allIds = [
    ...Object.keys(wood),
    ...Object.keys(metal),
    ...Object.keys(fiber),
    FIBER_ID,
    WOOD_ID,
    METAL_ID,
  ].map((v) => Number(v));

  // get items from db that unlock some node
  const items = await getItems(allIds);

  const getRefinedData = (source: RefinedSources, id: number) => {
    return {
      item: items[id],
      sources: Object.entries(source).map(([sourceId, costs]) => ({
        id: sourceId,
        item: items[sourceId],
        costs,
      })).filter((v) => v.item),
    };
  };

  // add the item to each node
  const metalData = getRefinedData(metal, METAL_ID);
  const MetalTable = createDataTable(metalData.sources, ({ id }) => id);
  
  const woodData = getRefinedData(wood, WOOD_ID);
  const WoodTable = createDataTable(woodData.sources, ({ id }) => id);
  
  const fiberData = getRefinedData(fiber, FIBER_ID);
  const FiberTable = createDataTable(fiberData.sources, ({ id }) => id);

  return (
    <>
      <Description>
        <Trans id="homestead.refinedMaterials.description"/>
      </Description>
      <Description>
        <Trans id="homestead.refinedMaterials.help"/>
      </Description>

      <Headline id="refinedMetal" actions={<ColumnSelect table={MetalTable}/>}>
        <ItemLink item={metalData.item}/>
      </Headline>
      <RefinedDataTable table={MetalTable}/>

      <Headline id="refinedWood" actions={<ColumnSelect table={WoodTable}/>}>
        <ItemLink item={woodData.item}/>
      </Headline>
      <RefinedDataTable table={WoodTable}/>

      <Headline id="refinedWood" actions={<ColumnSelect table={FiberTable}/>}>
        <ItemLink item={fiberData.item}/>
      </Headline>
      <RefinedDataTable table={FiberTable}/>

      <PageView page="homestead/refinedMaterials"/>
    </>
  );
}

export const metadata = {
  title: 'Homestead Refined Materials',
};

type RefinedDataSource = {
  id: string;
  item: Awaited<ReturnType<typeof getItems>>[string];
  costs: RefinedCosts;
};
type HomesteadRefinedMatsDataTable = {
  Table: FC<DataTableProps<RefinedDataSource>>;
  Column: FC<DataTableColumnProps<RefinedDataSource>>;
  DynamicColumns: FC<DataTableDynamicColumnsProps<RefinedDataSource>>;
  ColumnSelection: FC<DataTableColumnSelectionProps>;
};

const DEFAULT_EFFICIENCY = 2;
const RefinedDataTable: FC<{ table: HomesteadRefinedMatsDataTable }> = ({
  table,
}) => (
  <table.Table>
    <table.Column id="id" title="Id" small hidden>
      {({ id }) => id}
    </table.Column>
    <table.Column id="source" title="Source">
      {({ item }) => <ItemLink item={item}/>}
    </table.Column>
    <table.Column
      id="buyPrice"
      title="Buy Price"
      sortBy={({ item, costs }) => getCostPerUnit(item.buyPrice, costs[DEFAULT_EFFICIENCY])}
      align="right"
    >
      {({ item, costs }) => itemTableColumn.buyPrice({
        ...item,
        buyPrice: getCostPerUnit(item.buyPrice, costs[DEFAULT_EFFICIENCY])
      }, {})}
    </table.Column>
    <table.Column
      id="sellPrice"
      title="Sell Price"
      sortBy={({ item, costs }) => getCostPerUnit(item.sellPrice, costs[DEFAULT_EFFICIENCY])}
      align="right"
      hidden
    >
      {({ item, costs }) => itemTableColumn.sellPrice({
        ...item,
        sellPrice: getCostPerUnit(item.sellPrice, costs[DEFAULT_EFFICIENCY])
      }, {})}
    </table.Column>
  </table.Table>
);

const getCostPerUnit = (price: number | null, rate: ConversionRate) => price == null ? null : price * rate.required / rate.produced;
