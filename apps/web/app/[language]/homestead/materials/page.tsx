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
import { data, materials, type ConversionRate, type Efficiency, type Material } from './data';
import { Switch } from '@gw2treasures/ui/components/Form/Switch';
import type { PageProps } from '@/lib/next';
import { UnknownItem } from '@/components/Item/UnknownItem';
import type { Metadata } from 'next';
import { getAlternateUrls } from '@/lib/url';
import { translate } from '@/lib/translate';
import { FlexRow } from '@gw2treasures/ui/components/Layout/FlexRow';
import { getSearchParamAsNumber, type SearchParams } from '@/lib/searchParams';
import { OutputCount } from '@/components/Item/OutputCount';
import { FormatNumber } from '@/components/Format/FormatNumber';
import { Tip } from '@gw2treasures/ui/components/Tip/Tip';
import { Coins } from '@/components/Format/Coins';
import { Fraction } from '@/components/Format/Fraction';
import { ResetTimer } from '@/components/Reset/ResetTimer';

const getItems = cache(
  async (ids: number[]) => {
    const items = await db.item.findMany({
      where: { id: { in: ids }},
      select: {
        ...linkProperties,
        tpTradeable: true, tpCheckedAt: true,
        buyPrice: true, buyQuantity: true,
        sellPrice: true, sellQuantity: true
      },
    });

    return Object.fromEntries(groupById(items).entries());
  },
  ['homestead-refined-mats'],
  { revalidate: 60 * 5 }
);

type Efficiencies = Record<Material, Efficiency>;

export default async function RefinedMaterialsPage({ searchParams }: PageProps) {
  // get items from db
  const allItemIds = [
    ...Object.keys(data.wood.sources),
    ...Object.keys(data.metal.sources),
    ...Object.keys(data.fiber.sources),
    data.wood.itemId,
    data.metal.itemId,
    data.fiber.itemId,
  ].map(Number);
  const items = await getItems(allItemIds);

  const efficiencies = getEfficiencies(searchParams);

  // map sources to item from db
  const getRefinedMaterialProps = (id: Material): RefinedMaterialProps => {
    return {
      id, efficiencies,
      material: items[data[id].itemId],
      sources: Object.entries(data[id].sources).map(([sourceId, costs]) => ({
        id: Number(sourceId),
        item: items[sourceId],
        rate: costs[efficiencies[id]],
      })),
    };
  };

  return (
    <>
      <Description actions={<>Reset: <ResetTimer reset="current-weekly"/></>}>
        <Trans id="homestead.materials.description"/>
      </Description>

      <RefinedMaterial {...getRefinedMaterialProps('metal')}/>
      <RefinedMaterial {...getRefinedMaterialProps('wood')}/>
      <RefinedMaterial {...getRefinedMaterialProps('fiber')}/>

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
  id: Material,
  efficiencies: Efficiencies,
  material: DbItem,
  sources: {
    id: number,
    item?: DbItem,
    rate: ConversionRate
  }[]
}

const RefinedMaterial: FC<RefinedMaterialProps> = ({ id, material, efficiencies, sources }) => {
  const Sources = createDataTable(sources, ({ id }) => id);

  return (
    <>
      <Headline id={id} actions={[<EfficiencySwitch key="efficiency" id={id} efficiencies={efficiencies}/>, <ColumnSelect key="columns" table={Sources}/>]}>
        <ItemLink item={material}/>
      </Headline>
      <Sources.Table initialSortBy="totalBuyPrice">
        <Sources.Column id="id" title={<Trans id="itemTable.column.id"/>} align="right" small hidden sortBy="id">
          {({ id }) => id}
        </Sources.Column>
        <Sources.Column id="source" title={<Trans id="itemTable.column.item"/>}>
          {({ item, id, rate }) => (
            <OutputCount count={rate.required}>
              {item ? <ItemLink item={item}/> : <UnknownItem id={id}/>}
            </OutputCount>
          )}
        </Sources.Column>
        <Sources.Column id="amountProduced" title={<Trans id="homestead.materials.column.amountProduced"/>} sortBy={({ rate }) => rate.produced} align="right">
          {({ rate }) => rate.produced}
        </Sources.Column>
        <Sources.Column id="rate" title={<Trans id="homestead.materials.column.rate"/>} sortBy={({ rate }) => rate.required / rate.produced} align="right" hidden>
          {({ rate }) => <FormatNumber value={rate.required / rate.produced}/>}
        </Sources.Column>
        <Sources.Column id="buyPrice" title={<Trans id="itemTable.column.buyPrice"/>} sortBy={({ item }) => item?.buyPrice} align="right" hidden>
          {({ item }) => item && itemTableColumn.buyPrice(item, {})}
        </Sources.Column>
        <Sources.Column id="buyQuantity" title={<Trans id="itemTable.column.buyQuantity"/>} sortBy={({ item }) => item?.buyQuantity} align="right" hidden>
          {({ item }) => item && itemTableColumn.buyQuantity(item, {})}
        </Sources.Column>
        <Sources.Column id="sellPrice" title={<Trans id="itemTable.column.sellPrice"/>} sortBy={({ item }) => item?.sellPrice} align="right" hidden>
          {({ item }) => item && itemTableColumn.sellPrice(item, {})}
        </Sources.Column>
        <Sources.Column id="sellQuantity" title={<Trans id="itemTable.column.sellQuantity"/>} sortBy={({ item }) => item?.sellQuantity} align="right" hidden>
          {({ item }) => item && itemTableColumn.sellQuantity(item, {})}
        </Sources.Column>
        <Sources.Column
          id="totalBuyPrice"
          title={<Trans id="homestead.materials.column.buyPricePer"/>}
          sortBy={({ item, rate }) => getCostPerUnit(item?.buyPrice, rate)}
          align="right"
        >
          {({ item, rate }) => item && item.buyPrice && (
            <Tip tip={<><Fraction numerator="Required" denominator="Produced"/> &times; Price = <Fraction numerator={rate.required} denominator={rate.produced}/> &times; (<Coins value={item.buyPrice}/>)</>} preferredPlacement="top-end">
              <span>
                {itemTableColumn.buyPrice({
                  ...item,
                  buyPrice: getCostPerUnit(item.buyPrice, rate)
                }, {})}
              </span>
            </Tip>
          )}
        </Sources.Column>
        <Sources.Column
          id="totalSellPrice"
          title={<Trans id="homestead.materials.column.sellPricePer"/>}
          sortBy={({ item, rate }) => getCostPerUnit(item?.sellPrice, rate)}
          align="right"
        >
          {({ item, rate }) => item && item.sellPrice && (
            <Tip tip={<><Fraction numerator="Required" denominator="Produced"/> &times; Price = <Fraction numerator={rate.required} denominator={rate.produced}/> &times; (<Coins value={item.sellPrice}/>)</>} preferredPlacement="top-end">
              <span>
                {itemTableColumn.sellPrice({
                  ...item,
                  sellPrice: getCostPerUnit(item.sellPrice, rate)
                }, {})}
              </span>
            </Tip>
          )}
        </Sources.Column>
      </Sources.Table>
    </>
  );
};

const getCostPerUnit = (price: number | null | undefined, rate: ConversionRate) => price != null
  ? Math.round(price * rate.required / rate.produced)
  : null;


interface EfficiencySwitchProps {
  id: Material,
  efficiencies: Efficiencies;
}

const EfficiencySwitch: FC<EfficiencySwitchProps> = ({ id, efficiencies }) => (
  <FlexRow>
    <Trans id="homestead.materials.efficiency"/>
    <Switch>
      <Switch.Control type="link" replace scroll={false} active={efficiencies[id] === 0} href={buildUrl({ ...efficiencies, [id]: 0 })}>0</Switch.Control>
      <Switch.Control type="link" replace scroll={false} active={efficiencies[id] === 1} href={buildUrl({ ...efficiencies, [id]: 1 })}>1</Switch.Control>
      <Switch.Control type="link" replace scroll={false} active={efficiencies[id] === 2} href={buildUrl({ ...efficiencies, [id]: 2 })}>2</Switch.Control>
    </Switch>
  </FlexRow>
);

function buildUrl(efficiencies: Efficiencies) {
  const params = new URLSearchParams();
  for(const material of materials) {
    if((efficiencies[material] ?? 2) !== 2) {
      params.set(material, efficiencies[material].toString());
    }
  }

  return params.size > 0
    ? `/homestead/materials?${params.toString()}`
    : '/homestead/materials';
}

function getEfficiencies(searchParams: SearchParams) {
  const efficiencies: Efficiencies = { metal: 2, wood: 2, fiber: 2 };

  for(const material of materials) {
    const rawValue = getSearchParamAsNumber(searchParams[material], 2);
    if([0, 1, 2].includes(rawValue)) {
      efficiencies[material] = rawValue as Efficiency;
    }
  }

  return efficiencies;
}
