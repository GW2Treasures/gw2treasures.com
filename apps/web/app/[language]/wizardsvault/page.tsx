import { CurrencyLink } from '@/components/Currency/CurrencyLink';
import { ItemLink } from '@/components/Item/ItemLink';
import { OutputCount } from '@/components/Item/OutputCount';
import { HeroLayout } from '@/components/Layout/HeroLayout';
import { linkProperties, linkPropertiesWithoutRarity } from '@/lib/linkProperties';
import { db } from '@/lib/prisma';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { FlexRow } from '@gw2treasures/ui/components/Layout/FlexRow';
import { createDataTable } from '@gw2treasures/ui/components/Table/DataTable';
import { WizardVaultObjectives } from './objectives';

export default async function WizardsVaultPage() {
  const listings = await db.wizardsVaultListing.findMany({ include: { item: { select: linkProperties }}, orderBy: { type: 'asc' }});
  const astralAcclaim = await db.currency.findUnique({ where: { id: 63 }, select: linkPropertiesWithoutRarity });

  const Listings = createDataTable(listings, ({ id }) => id);

  return (
    <HeroLayout hero={<Headline id="wizardsvault">Wizard&apos;s Vault</Headline>} color="#ff9800">
      <Headline id="objectives">Objectives</Headline>
      <WizardVaultObjectives/>

      <Headline id="rewards">Rewards</Headline>
      <Listings.Table>
        <Listings.Column id="item" title="Item">{({ item, itemIdRaw, count }) => <OutputCount count={count}>{item ? <ItemLink item={item}/> : `Unknown item ${itemIdRaw}`}</OutputCount>}</Listings.Column>
        <Listings.Column id="type" title="Type" sortBy="type">{({ type }) => type}</Listings.Column>
        <Listings.Column id="cost" title="Cost" align="right" sortBy="cost">{({ cost }) => (<FlexRow align="right">{cost} <CurrencyLink currency={astralAcclaim!}/></FlexRow>)}</Listings.Column>
      </Listings.Table>
    </HeroLayout>
  );
}

export const metadata = {
  title: 'Wizard\'s Vault'
};
