import { Trans } from '@/components/I18n/Trans';
import { ItemTable } from '@/components/ItemTable/ItemTable';
import { ItemTableColumnsButton } from '@/components/ItemTable/ItemTableColumnsButton';
import { ItemTableContext } from '@/components/ItemTable/ItemTableContext';
import { PageLayout } from '@/components/Layout/PageLayout';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import type { Metadata } from 'next';

const itemIds = [
  86601,
  86627,
  77604,
];

export default function WintersdayPage() {
  return (
    <PageLayout>
      <ItemTableContext id="wintersday">
        <p><Trans id="festival.wintersday.description"/></p>
        <Headline actions={<ItemTableColumnsButton/>} id="items"><Trans id="navigation.items"/></Headline>
        <ItemTable query={{ where: { id: { in: itemIds }}}} defaultColumns={['item', 'rarity', 'type', 'buyPrice', 'buyPriceTrend', 'sellPrice', 'sellPriceTrend']}/>
      </ItemTableContext>
    </PageLayout>
  );
}

export const metadata: Metadata = {
  title: 'Wintersday'
};
