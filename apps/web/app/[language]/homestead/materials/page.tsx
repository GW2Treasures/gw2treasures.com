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
import { createDataTable } from '@gw2treasures/ui/components/Table/DataTable';
import type { FC } from 'react';
import {
  fiber,
  FIBER_ID,
  metal,
  METAL_ID,
  wood,
  WOOD_ID,
  type ConversionRate,
  type RefinedSources,
} from './data';
import { Switch } from '@gw2treasures/ui/components/Form/Switch';
import type { PageProps } from '@/lib/next';
import { UnknownItem } from '@/components/Item/UnknownItem';
import type { Metadata } from 'next';
import { getAlternateUrls } from '@/lib/url';
import { translate } from '@/lib/translate';
import { FlexRow } from '@gw2treasures/ui/components/Layout/FlexRow';
import { getSearchParamAsNumber } from '@/lib/searchParams';
import { OutputCount } from '@/components/Item/OutputCount';

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

export default async function RefinedMaterialsPage({ searchParams: { efficiency: rawEfficiency }}: PageProps) {
  // get items from db
  const allItemIds = [
    ...Object.keys(wood),
    ...Object.keys(metal),
    ...Object.keys(fiber),
    FIBER_ID,
    WOOD_ID,
    METAL_ID,
  ].map(Number);
  const items = await getItems(allItemIds);

  // parse efficiency query param
  const rawEfficiencyNumber = getSearchParamAsNumber(rawEfficiency, 2);
  // make sure only valid values are allowed (checking with Math.min/max still allows to pass decimals like 1.5)
  const efficiency = [0, 1, 2].includes(rawEfficiencyNumber) ? rawEfficiencyNumber : 2;

  // map sources to item from db
  const getRefinedData = (source: RefinedSources, outputItemId: number): Omit<RefinedMaterialProps, 'id'> => {
    return {
      material: items[outputItemId],
      sources: Object.entries(source).map(([sourceId, costs]) => ({
        id: Number(sourceId),
        item: items[sourceId],
        rate: costs[efficiency],
      })),
    };
  };

  return (
    <>
      <Description>
        <Trans id="homestead.materials.description"/>
      </Description>
      <Description>
        <Trans id="homestead.materials.help"/>
      </Description>

      <FlexRow>
        <Trans id="homestead.materials.efficiency"/>
        <Switch>
          <Switch.Control type="link" replace active={efficiency === 0} href="/homestead/materials?efficiency=0">0</Switch.Control>
          <Switch.Control type="link" replace active={efficiency === 1} href="/homestead/materials?efficiency=1">1</Switch.Control>
          <Switch.Control type="link" replace active={efficiency === 2} href="/homestead/materials">2</Switch.Control>
        </Switch>
      </FlexRow>

      <RefinedMaterial id="metal" {...getRefinedData(metal, METAL_ID)}/>
      <RefinedMaterial id="wood" {...getRefinedData(wood, WOOD_ID)}/>
      <RefinedMaterial id="fiber" {...getRefinedData(fiber, FIBER_ID)}/>

      <PageView page="homestead/refinedMaterials"/>
    </>
  );
}

export function generateMetadata({ params }: PageProps): Metadata {
  return {
    title: translate('homestead.materials', params.language),
    // make sure the efficiency query parameter is not part of the canonical URL, so only the default gets indexed by search engines
    alternates: getAlternateUrls('/homestead/materials')
  };
}

type DbItem = Awaited<ReturnType<typeof getItems>>[string];

interface RefinedMaterialProps {
  id: string,
  material: DbItem,
  sources: {
    id: number,
    item?: DbItem,
    rate: ConversionRate
  }[]
}

const RefinedMaterial: FC<RefinedMaterialProps> = ({ id, material, sources }) => {
  const Sources = createDataTable(sources, ({ id }) => id);

  return (
    <>
      <Headline id={id} actions={<ColumnSelect table={Sources}/>}>
        <ItemLink item={material}/>
      </Headline>
      <Sources.Table>
        <Sources.Column id="id" title="Id" small hidden>
          {({ id }) => id}
        </Sources.Column>
        <Sources.Column id="source" title="Source">
          {({ item, id, rate }) => (
            <OutputCount count={rate.required}>
              {item ? <ItemLink item={item}/> : <UnknownItem id={id}/>}
            </OutputCount>
          )}
        </Sources.Column>
        <Sources.Column
          id="amountProduced"
          title="Amount Produced"
          sortBy={({ rate }) => rate.produced}
          align="right"
        >
          {({ rate }) => rate.produced}
        </Sources.Column>
        <Sources.Column
          id="buyPrice"
          title="Total Buy Price"
          sortBy={({ item, rate }) => getCostPerUnit(item?.buyPrice, rate)}
          align="right"
        >
          {({ item, rate }) => item && itemTableColumn.buyPrice({
            ...item,
            buyPrice: getCostPerUnit(item.buyPrice, rate)
          }, {})}
        </Sources.Column>
        <Sources.Column
          id="sellPrice"
          title="Total Sell Price"
          sortBy={({ item, rate }) => getCostPerUnit(item?.sellPrice, rate)}
          align="right"
        >
          {({ item, rate }) => item && itemTableColumn.sellPrice({
            ...item,
            sellPrice: getCostPerUnit(item.sellPrice, rate)
          }, {})}
        </Sources.Column>
      </Sources.Table>
    </>
  );
};

const getCostPerUnit = (price: number | null | undefined, rate: ConversionRate) => price != null
  ? Math.round(price * rate.required / rate.produced)
  : null;
