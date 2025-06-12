import type { ItemStat } from '@gw2treasures/database';
import { createDataTable } from '@gw2treasures/ui/components/Table/DataTable';
import type { FC, ReactNode } from 'react';
import { Trans } from '../I18n/Trans';
import { compareLocalizedName, localizedName } from '@/lib/localizedName';
import { getLanguage, getTranslate } from '@/lib/translate';
import { type ItemStat as ApiItemStat } from '@gw2api/types/data/itemstat';
import type { Attribute } from '@gw2api/types/data/item';
import type { IconName } from '@gw2treasures/icons';
import { AttributeCell, ShowAttributeValueCheckbox, ShowAttributeValueContextProvider } from './table.client';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { createSearchIndex, TableFilterButton, TableFilterProvider, TableFilterRow, TableSearchInput, type TableFilterDefinition } from '../Table/TableFilter';
import { ColumnSelect } from '../Table/ColumnSelect';

export interface ItemStatTableProps {
  headlineId: string,
  headline: ReactNode,
  itemStats: ItemStat[],
  attributeAdjustment?: number,
}

const allAttributes: Attribute[] = [
  'BoonDuration',
  'ConditionDamage',
  'ConditionDuration',
  'CritDamage',
  'Healing',
  'Power',
  'Precision',
  'Toughness',
  'Vitality'
];

export const ItemStatTable: FC<ItemStatTableProps> = async ({ headlineId, headline, itemStats, attributeAdjustment = 0 }) => {
  const language = await getLanguage();
  const t = getTranslate(language);

  const ItemStats = createDataTable(itemStats, ({ id }) => id);

  const calculateValue = (attribute: ApiItemStat.Attribute) => Math.round(attributeAdjustment * attribute.multiplier + attribute.value);

  // find max attributes count and max value per itemstat to set colSpan and attribute value alignment correctly
  const [maxAttributes, maxValue] = itemStats.reduce(
    (max, itemStat) => [
      Math.max(max[0], itemStat.attributes.length),
      Math.max(max[1], itemStat.attributes.reduce<number>((m, attribute) => Math.max(m, calculateValue(attribute as unknown as ApiItemStat.Attribute)), 0))
    ],
    [1, 0]
  );

  const maxValueWidth = maxValue.toString().length;

  const filter: TableFilterDefinition[] = allAttributes.map((attribute) => ({
    id: attribute,
    name: t(`attribute.${attribute}`),
    rowIndexes: itemStats.map((stat, i) => [stat, i] as const)
      .filter(([stat]) => (stat.attributes as unknown[] as ApiItemStat.Attribute[]).some((a) => a.attribute === attribute))
      .map(([, index]) => index)
  }));

  const search = createSearchIndex(itemStats, (stat) => [localizedName(stat, language), ...(stat.attributes as unknown[] as ApiItemStat.Attribute[]).map((attribute) => t(`attribute.${attribute.attribute}`))]);

  return (
    <ShowAttributeValueContextProvider>
      <TableFilterProvider filter={filter} searchIndex={search} filterMode="and">
        <Headline id={headlineId} actions={[
          <ShowAttributeValueCheckbox key="show-values"><Trans id="item.itemStats.showValues"/></ShowAttributeValueCheckbox>,
          <TableSearchInput key="search"/>,
          <TableFilterButton key="filter" totalCount={itemStats.length}/>,
          <ColumnSelect key="columns" table={ItemStats}/>
        ]}
        >
          {headline}
        </Headline>

        <ItemStats.Table initialSortBy="name" rowFilter={TableFilterRow} collapsed>
          <ItemStats.Column id="id" title={<Trans id="itemTable.column.id"/>} align="right" small hidden sortBy="id">
            {({ id }) => id}
          </ItemStats.Column>
          <ItemStats.Column id="name" title={<Trans id="itemTable.column.name"/>} sort={compareLocalizedName(language)}>
            {(itemStat) => localizedName(itemStat, language)}
          </ItemStats.Column>
          <ItemStats.Column id="itemstats" title={<Trans id="itemTable.column.itemstats"/>} colSpan={maxAttributes}>
            {({ attributes }) => attributes.length === 9 ? (
              <AttributeCell colSpan={maxAttributes} icon="upgrade-slot" value={calculateValue(attributes[0] as unknown as ApiItemStat.Attribute)} alignmentWidth={maxValueWidth}>
                <Trans id="attribute.allAttributes"/>
              </AttributeCell>
            ) : (attributes as unknown[] as ApiItemStat.Attribute[]).map((attribute, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <AttributeCell key={index}
                colSpan={index === attributes.length - 1 ? (maxAttributes - attributes.length + 1) : undefined}
                icon={attributeIcon(attribute.attribute)}
                major={attribute.multiplier >= .3}
                value={calculateValue(attribute)}
                alignmentWidth={maxValueWidth}
                small={index < attributes.length - 1}
              >
                <Trans id={`attribute.${attribute.attribute}`}/>
              </AttributeCell>
            ))}
          </ItemStats.Column>
        </ItemStats.Table>
      </TableFilterProvider>
    </ShowAttributeValueContextProvider>
  );
};

function attributeIcon(attribute: Attribute): IconName {
  switch(attribute) {
    case 'Power': return 'attribute-power';
    case 'Toughness': return 'attribute-toughness';
    case 'Vitality': return 'heart';
    case 'Precision': return 'attribute-precision';
    case 'CritDamage': return 'attribute-crit-damage';
    case 'ConditionDamage': return 'attribute-condition-damage';
    case 'ConditionDuration': return 'attribute-condition-duration';
    case 'BoonDuration': return 'attribute-boon-duration';
    case 'Healing': return 'attribute-healing';
    case 'AgonyResistance': return 'fractals';
  }
}
