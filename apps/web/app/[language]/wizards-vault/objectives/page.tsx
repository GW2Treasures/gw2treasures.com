import { AstralAcclaim } from '@/components/Format/AstralAcclaim';
import { Description } from '@/components/Layout/Description';
import { PageLayout } from '@/components/Layout/PageLayout';
import { ColumnSelect } from '@/components/Table/ColumnSelect';
import { Waypoint } from '@/components/Waypoint/Waypoint';
import { cache } from '@/lib/cache';
import { compareLocalizedName, localizedName } from '@/lib/localizedName';
import { createMetadata } from '@/lib/metadata';
import type { PageProps } from '@/lib/next';
import { db } from '@/lib/prisma';
import { FlexRow } from '@gw2treasures/ui/components/Layout/FlexRow';
import { createDataTable } from '@gw2treasures/ui/components/Table/DataTable';
import Link from 'next/link';

const getObjectives = cache(() => {
  return db.wizardsVaultObjective.findMany();
}, ['wizards-vault-objectives'], { revalidate: 60 * 60 });

export default async function WizardsVaultObjectivesPage({ params }: PageProps) {
  const { language } = await params;
  const objectives = await getObjectives();

  const Objectives = createDataTable(objectives, ({ id }) => id);

  return (
    <PageLayout>
      <Description actions={<ColumnSelect table={Objectives}/>}>
        This page lists all possible Wizard&apos;s Vault objectives. Go to <Link href="/wizards-vault">Wizard&apos;s Vault</Link> to see your current personal objectives.
      </Description>

      <Objectives.Table>
        <Objectives.Column id="id" sortBy="id" title="ID" align="right" hidden>{({ id }) => id}</Objectives.Column>
        <Objectives.Column id="track" sortBy="track" title="Track">{({ track }) => track}</Objectives.Column>
        <Objectives.Column id="title" sort={compareLocalizedName(language)} title="Objective">{(objective) => localizedName(objective, language)}</Objectives.Column>
        <Objectives.Column id="wp" title="Waypoint">{({ waypointId }) => waypointId && <FlexRow><Waypoint id={waypointId}/> {waypointId}</FlexRow>}</Objectives.Column>
        <Objectives.Column id="acclaim" sortBy="acclaim" title="Astral Acclaim" align="right">{({ acclaim }) => <AstralAcclaim value={acclaim}/>}</Objectives.Column>
      </Objectives.Table>
    </PageLayout>
  );
}

export const generateMetadata = createMetadata({
  title: 'Objectives'
});
