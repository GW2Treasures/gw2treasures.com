import { Trans } from '@/components/I18n/Trans';
import { createDataTable } from '@gw2treasures/ui/components/Table/DataTable';
import { linkProperties, linkPropertiesWithoutRarity } from '@/lib/linkProperties';
import { db } from '@/lib/prisma';
import { ItemLink } from '@/components/Item/ItemLink';
import { ColumnSelect } from '@/components/Table/ColumnSelect';
import { groupById } from '@gw2treasures/helper/group-by';
import { cache } from '@/lib/cache';
import { globalColumnRenderer as itemTableColumn } from '@/components/ItemTable/columns';
import { PageView } from '@/components/PageView/PageView';
import { translate } from '@/lib/translate';
import type { PageProps } from '@/lib/next';
import type { Metadata } from 'next';
import { getAlternateUrls } from '@/lib/url';
import { Gw2Accounts } from '@/components/Gw2Api/Gw2Accounts';
import { Scope } from '@gw2me/client';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { Table } from '@gw2treasures/ui/components/Table/Table';
import { AchievementLink } from '@/components/Achievement/AchievementLink';
import { GardenPlotAccountRows } from './page.client';
import type { Icon } from '@gw2treasures/database';
import { FormatNumber } from '@/components/Format/FormatNumber';
import { EntityIcon } from '@/components/Entity/EntityIcon';
import { UnknownItem } from '@/components/Item/UnknownItem';
import { ItemList } from '@/components/ItemList/ItemList';
import { localizedName } from '@/lib/localizedName';
import styles from './page.module.css';

type Plot = {
  nodeId: string;
  itemId: number;
  source: 'chef' | 'black-lion'
};
type Crop = {
  seedItemId: number,
  gatheredItemId: number[],
  type: 'chef' | 'black-lion'
};

const plots: Plot[] = [
  { nodeId: 'garden_plot_01', itemId: 86786, source: 'black-lion' },
  { nodeId: 'garden_plot_02', itemId: 86786, source: 'black-lion' },
  { nodeId: 'garden_plot_03', itemId: 91777, source: 'chef' },
];

const crops: Crop[] = [
  { seedItemId: 91681, gatheredItemId: [91701], type: 'chef' }, // Varietal Sesame Seed Pouch
  { seedItemId: 91695, gatheredItemId: [91715], type: 'chef' }, // Varietal Cilantro Seed Pouch
  { seedItemId: 91749, gatheredItemId: [91793], type: 'chef' }, // Varietal Mint Seed Pouch
  { seedItemId: 91776, gatheredItemId: [91796], type: 'chef' }, // Varietal Clove Seed Pouch
  { seedItemId: 91802, gatheredItemId: [91869], type: 'chef' }, // Varietal Peppercorn Seed Pouch

  { seedItemId: 86743, gatheredItemId: [12246], type: 'black-lion' }, // Parsley Seed Pouch
  { seedItemId: 86747, gatheredItemId: [12329], type: 'black-lion' }, // Yam Slip Pouch
  { seedItemId: 86751, gatheredItemId: [12336], type: 'black-lion' }, // Dill Herb Seed Pouch
  { seedItemId: 86761, gatheredItemId: [12531], type: 'black-lion' }, // Coriander Seed Pouch
  { seedItemId: 86770, gatheredItemId: [12547], type: 'black-lion' }, // Saffron Seed Pouch
  { seedItemId: 86772, gatheredItemId: [12333], type: 'black-lion' }, // Kale Seed Pouch
  { seedItemId: 86773, gatheredItemId: [12247], type: 'black-lion' }, // Bay Leaf Seed Pouch
  { seedItemId: 86774, gatheredItemId: [12142], type: 'black-lion' }, // Onion Seed Pouch
  { seedItemId: 86775, gatheredItemId: [12535], type: 'black-lion' }, // Rutabaga Seed Pouch
  { seedItemId: 86782, gatheredItemId: [12505], type: 'black-lion' }, // Asparagus Seed Pouch
  { seedItemId: 86783, gatheredItemId: [12507], type: 'black-lion' }, // Parsnip Seed Pouch
  { seedItemId: 86790, gatheredItemId: [12504], type: 'black-lion' }, // Cayenne Pepper Seed Pouch
  { seedItemId: 86794, gatheredItemId: [86840], type: 'black-lion' }, // Koda's Blossom Seed Pouch
  { seedItemId: 86799, gatheredItemId: [73096], type: 'black-lion' }, // Allspice Shrub Seed Pouch
  { seedItemId: 86802, gatheredItemId: [12536], type: 'black-lion' }, // Mint Seed Pouch
  { seedItemId: 86803, gatheredItemId: [66524, 66522], type: 'black-lion' }, // Cactus Seed Pouch
  { seedItemId: 86806, gatheredItemId: [12546], type: 'black-lion' }, // Lemongrass Seed Pouch
  { seedItemId: 86809, gatheredItemId: [12332], type: 'black-lion' }, // Cabbage Seed Pouch
  { seedItemId: 86812, gatheredItemId: [12135], type: 'black-lion' }, // Potato Eyes Pouch
  { seedItemId: 86814, gatheredItemId: [12234], type: 'black-lion' }, // Vanilla Seed Pouch
  { seedItemId: 86815, gatheredItemId: [73504], type: 'black-lion' }, // Sawgill Mushroom Spore Pouch
  { seedItemId: 86816, gatheredItemId: [12147], type: 'black-lion' }, // Mushroom Spore Pouch
  { seedItemId: 86817, gatheredItemId: [12331], type: 'black-lion' }, // Chili Pepper Seed Pouch
  { seedItemId: 86818, gatheredItemId: [12241], type: 'black-lion' }, // Spinach Seed Pouch
  { seedItemId: 86819, gatheredItemId: [12342], type: 'black-lion' }, // Sesame Seed Pouch
  { seedItemId: 86820, gatheredItemId: [86798], type: 'black-lion' }, // Ascalonian Royal Iris Seed Pouch
  { seedItemId: 86821, gatheredItemId: [12538], type: 'black-lion' }, // Sugar Pumpkin Seed Pouch
  { seedItemId: 86824, gatheredItemId: [12161], type: 'black-lion' }, // Beet Seed Pouch
  { seedItemId: 86825, gatheredItemId: [12255], type: 'black-lion' }, // Blueberry Seed Pouch
  { seedItemId: 86828, gatheredItemId: [12508], type: 'black-lion' }, // Leek Seed Pouch
  { seedItemId: 86838, gatheredItemId: [36731], type: 'black-lion' }, // Passion Fruit Seed Pouch
  { seedItemId: 86841, gatheredItemId: [12248], type: 'black-lion' }, // Thyme Seed Pouch
  { seedItemId: 86846, gatheredItemId: [12511], type: 'black-lion' }, // Butternut Squash Seed Pouch
  { seedItemId: 86848, gatheredItemId: [82866], type: 'black-lion' }, // Lentil Seed Pouch
  { seedItemId: 86850, gatheredItemId: [12506], type: 'black-lion' }, // Tarragon Seed Pouch
  { seedItemId: 86851, gatheredItemId: [12534], type: 'black-lion' }, // Clove Seed Pouch
  { seedItemId: 86853, gatheredItemId: [12162], type: 'black-lion' }, // Turnip Seed Pouch
  { seedItemId: 86854, gatheredItemId: [12512], type: 'black-lion' }, // Artichoke Seed Pouch
  { seedItemId: 86861, gatheredItemId: [12163], type: 'black-lion' }, // Garlic Seed Pouch
  { seedItemId: 86862, gatheredItemId: [12341], type: 'black-lion' }, // Grape Seed Pouch
  { seedItemId: 86863, gatheredItemId: [12244], type: 'black-lion' }, // Oregano Seed Pouch
  { seedItemId: 86867, gatheredItemId: [73113], type: 'black-lion' }, // Cassava Seed Pouch
  { seedItemId: 86874, gatheredItemId: [86843], type: 'black-lion' }, // Shing Jea Orchid Seed Pouch
  { seedItemId: 86875, gatheredItemId: [12334], type: 'black-lion' }, // Portobello Mushroom Spore Pouch
  { seedItemId: 86878, gatheredItemId: [12253], type: 'black-lion' }, // Strawberry Seed Pouch
  { seedItemId: 86879, gatheredItemId: [12134], type: 'black-lion' }, // Carrot Seed Pouch
  { seedItemId: 86881, gatheredItemId: [12532], type: 'black-lion' }, // Cauliflower Seed Pouch
  { seedItemId: 86882, gatheredItemId: [12335], type: 'black-lion' }, // Rosemary Seed Pouch
  { seedItemId: 86884, gatheredItemId: [12236], type: 'black-lion' }, // Black Peppercorn Seed Pouch
  { seedItemId: 86888, gatheredItemId: [12238], type: 'black-lion' }, // Lettuce Seed Pouch
  { seedItemId: 86891, gatheredItemId: [12537], type: 'black-lion' }, // Blackberry Seed Pouch
  { seedItemId: 86892, gatheredItemId: [12254], type: 'black-lion' }, // Raspberry Seed Pouch
  { seedItemId: 86893, gatheredItemId: [12330], type: 'black-lion' }, // Zucchini Seed Pouch
  { seedItemId: 86894, gatheredItemId: [86890], type: 'black-lion' }, // Krytan Spiderwort Seed Pouch
  { seedItemId: 86895, gatheredItemId: [12243], type: 'black-lion' }, // Sage Seed Pouch
];

const gourmetTrainingAchievementId = 4896;
const gemIcon: Icon = { id: 502065, signature: '220061640ECA41C0577758030357221B4ECCE62C', color: '#597bbb' };

const getData = cache(
  async ({ itemIds, achievementIds }: { itemIds: number[], achievementIds: number[] }) => {
    const [items, achievements] = await Promise.all([
      db.item.findMany({
        where: { id: { in: itemIds }},
        select: {
          ...linkProperties,
          tpTradeable: true, tpCheckedAt: true,
          buyPrice: true, buyQuantity: true,
          sellPrice: true, sellQuantity: true,
          tpHistory: { orderBy: { time: 'asc' }}
        }
      }),
      db.achievement.findMany({
        where: { id: { in: achievementIds }},
        select: linkPropertiesWithoutRarity,
      })
    ]);

    return { items, achievements };
  }, ['homestead-garden'], { revalidate: 60 * 5 }
);

export default async function HomesteadGardenPlotPage({ params }: PageProps) {
  const { language } = await params;

  // collect all the item ids
  const itemIds = [
    // plot unlock items
    ...plots.map(({ itemId }) => itemId),
    ...crops.flatMap(({ seedItemId, gatheredItemId }) => [seedItemId, ...gatheredItemId])
  ];

  // get data from db
  const data = await getData({ itemIds, achievementIds: [gourmetTrainingAchievementId] });

  const items = groupById(data.items);
  const achievements = groupById(data.achievements);

  // create data-table
  const Crops = createDataTable(crops, ({ seedItemId }) => seedItemId);

  return (
    <>
      <Gw2Accounts requiredScopes={[Scope.GW2_Progression, Scope.GW2_Unlocks]} authorizationMessage="Authorize gw2treasures.com to view your homestead progression." loading={null}/>

      <p><Trans id="homestead.garden-plots.description"/></p>

      <Table>
        <thead>
          <tr>
            <th><Trans id="homestead.garden-plots"/></th>
            {plots.map((plot) => <th key={plot.nodeId} style={{ fontWeight: 'normal' }}><ItemLink item={items.get(plot.itemId)!}/></th>)}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th><b><Trans id="homestead.garden-plots.source"/></b></th>
            {plots.map((plot) => (
              <td key={plot.nodeId}>
                {plot.source === 'black-lion'
                  ? <><Trans id="homestead.garden-plots.source.black-lion"/>: <span style={{ whiteSpace: 'nowrap', display: 'inline-flex', gap: 4, alignItems: 'center' }}><FormatNumber value={1000}/><EntityIcon icon={gemIcon} size={32}/></span></>
                  : <AchievementLink achievement={achievements.get(gourmetTrainingAchievementId)!}/>}
              </td>
            ))}
          </tr>
          <GardenPlotAccountRows nodeIds={plots.map(({ nodeId }) => nodeId)}/>
        </tbody>
      </Table>

      <Headline id="crops" actions={<ColumnSelect table={Crops}/>}><Trans id="homestead.garden-plots.crops"/></Headline>
      <p><Trans id="homestead.garden-plots.crops.description"/></p>

      <Crops.Table>
        <Crops.Column id="id" title={<Trans id="itemTable.column.id"/>} sortBy="seedItemId" small hidden>
          {({ seedItemId }) => seedItemId}
        </Crops.Column>
        <Crops.Column id="seed" title={<Trans id="homestead.garden-plots.seed-pouch"/>} sortBy={({ seedItemId }) => items.has(seedItemId) ? localizedName(items.get(seedItemId)!, language) : seedItemId}>
          {({ seedItemId }) => items.has(seedItemId) ? <ItemLink item={items.get(seedItemId)!}/> : <UnknownItem id={seedItemId}/>}
        </Crops.Column>
        <Crops.Column id="type" title={<Trans id="itemTable.column.type"/>} sortBy="type">
          {({ type }) => <Trans id={`homestead.garden-plots.type.${type}`}/>}
        </Crops.Column>
        <Crops.Column id="gathered" title={<Trans id="homestead.garden-plots.gathered-items"/>} sortBy={({ gatheredItemId }) => items.has(gatheredItemId[0]) ? localizedName(items.get(gatheredItemId[0])!, language) : gatheredItemId[0]}>
          {({ gatheredItemId }) => <ItemList singleColumn>{gatheredItemId?.map((id) => <li key={id}><ItemLink item={items.get(id)!}/></li>)}</ItemList>}
        </Crops.Column>
        <Crops.Column id="buyPrice" title={<Trans id="itemTable.column.buyPrice"/>} sortBy={({ gatheredItemId }) => items.get(gatheredItemId[0])?.buyPrice} align="right" hidden>
          {({ gatheredItemId }) => <ul className={styles.list}>{gatheredItemId?.map((id) => <li key={id}>{items.has(id) ? itemTableColumn.buyPrice(items.get(id)!, {}) : '-'}</li>)}</ul>}
        </Crops.Column>
        <Crops.Column id="buyPriceTrend" title={<Trans id="itemTable.column.buyPriceTrend"/>} align="right" hidden>
          {({ gatheredItemId }) => <ul className={styles.list}>{gatheredItemId?.map((id) => <li key={id}>{items.has(id) ? itemTableColumn.buyPriceTrend(items.get(id)!, {}) : '-'}</li>)}</ul>}
        </Crops.Column>
        <Crops.Column id="buyQuantity" title={<Trans id="itemTable.column.buyQuantity"/>} sortBy={({ gatheredItemId }) => items.get(gatheredItemId[0])?.buyQuantity} align="right" hidden>
          {({ gatheredItemId }) => <ul className={styles.list}>{gatheredItemId?.map((id) => <li key={id}>{items.has(id) ? itemTableColumn.buyQuantity(items.get(id)!, {}) : '-'}</li>)}</ul>}
        </Crops.Column>
        <Crops.Column id="sellPrice" title={<Trans id="itemTable.column.sellPrice"/>} sortBy={({ gatheredItemId }) => items.get(gatheredItemId[0])?.sellPrice} align="right">
          {({ gatheredItemId }) => <ul className={styles.list}>{gatheredItemId?.map((id) => <li key={id}>{items.has(id) ? itemTableColumn.sellPrice(items.get(id)!, {}) : '-'}</li>)}</ul>}
        </Crops.Column>
        <Crops.Column id="sellPriceTrend" title={<Trans id="itemTable.column.sellPriceTrend"/>} align="right">
          {({ gatheredItemId }) => <ul className={styles.list}>{gatheredItemId?.map((id) => <li key={id}>{items.has(id) ? itemTableColumn.sellPriceTrend(items.get(id)!, {}) : '-'}</li>)}</ul>}
        </Crops.Column>
        <Crops.Column id="sellQuantity" title={<Trans id="itemTable.column.sellQuantity"/>} sortBy={({ gatheredItemId }) => items.get(gatheredItemId[0])?.sellQuantity} align="right" hidden>
          {({ gatheredItemId }) => <ul className={styles.list}>{gatheredItemId?.map((id) => <li key={id}>{items.has(id) ? itemTableColumn.sellQuantity(items.get(id)!, {}) : '-'}</li>)}</ul>}
        </Crops.Column>
      </Crops.Table>

      <PageView page="homestead/garden-plots"/>
    </>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { language } = await params;

  return {
    title: translate('homestead.garden-plots', language),
    description: translate('homestead.garden-plots.description', language),
    alternates: getAlternateUrls('/homestead/garden-plots', language),
    keywords: ['homestead', 'garden plot', 'garden', 'seed', 'crop', 'plant', 'herb', 'black lion', 'gourmet', 'chef', 'trading post', 'profit']
  };
}
