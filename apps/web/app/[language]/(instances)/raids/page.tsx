import { Table } from '@gw2treasures/ui/components/Table/Table';
import { raids } from '@gw2treasures/static-data/raids/index';
import { EntityIcon } from '@/components/Entity/EntityIcon';
import { parseIcon } from '@/lib/parseIcon';
import { FlexRow } from '@gw2treasures/ui/components/Layout/FlexRow';
import { Gw2AccountBodyCells, Gw2AccountHeaderCells } from '@/components/Gw2Api/Gw2AccountTableCells';
import { RaidClearCell, requiredScopes } from './page.client';
import { Description } from '@/components/Layout/Description';
import { ResetTimer } from '@/components/Reset/ResetTimer';
import { Trans } from '@/components/I18n/Trans';
import { Icon } from '@gw2treasures/ui';
import { Tip } from '@gw2treasures/ui/components/Tip/Tip';
import { getTranslate } from '@/lib/translate';
import type { PageProps } from '@/lib/next';
import type { Metadata } from 'next';

function getEmboldenedIndex() {
  const offsetStart = new Date(Date.UTC(2025, 1, 17, 8, 30));

  const millisecondsSince = new Date().valueOf() - offsetStart.valueOf();
  const fullWeeksSince = Math.floor(millisecondsSince / (7 * 24 * 60 * 60 * 1000));

  const index = fullWeeksSince % 8;

  return index;
}

export default function RaidsPage() {
  const emboldenedWing = getEmboldenedIndex() + 1;

  let wingNumber = 0;
  return (
    <>
      <Description actions={<span style={{ lineHeight: '36px' }}>Reset: <ResetTimer reset="current-daily"/></span>}>
        <Trans id="raids.description"/>
      </Description>
      <Table>
        <thead>
          <tr>
            <Table.HeaderCell small align="right">#</Table.HeaderCell>
            <Table.HeaderCell><Trans id="raids.name"/></Table.HeaderCell>
            <Table.HeaderCell><Trans id="raids.weekly"/></Table.HeaderCell>
            <Table.HeaderCell><Trans id="raids.encounter"/></Table.HeaderCell>
            <Gw2AccountHeaderCells requiredScopes={requiredScopes} noDataTable small/>
          </tr>
        </thead>
        {raids.flatMap((raid) => raid.wings.map((wing) => (
          <tbody key={wing.id}>
            {wing.events.map((event, index) => (
              <tr key={event.id}>
                {index === 0 && (
                  <>
                    <th rowSpan={wing.events.length} align="right">W{++wingNumber}</th>
                    <th rowSpan={wing.events.length}><Trans id={`raids.wing.${wing.id}`}/></th>
                    <td rowSpan={wing.events.length}>
                      <FlexRow>
                        {wingNumber === emboldenedWing && <Tip tip={<Trans id="raids.emboldened"/>}><Icon icon="raid-emboldened"/></Tip>}
                        {wingNumber === ((emboldenedWing + 1) % 8) && <Tip tip={<Trans id="raids.call-of-the-mists"/>}><Icon icon="raid-call-of-the-mists"/></Tip>}
                      </FlexRow>
                    </td>
                  </>
                )}
                <td>
                  <FlexRow>
                    {event.icon && <EntityIcon icon={parseIcon(event.icon)!} size={32}/>}
                    <Trans id={`raids.event.${event.id}`}/>
                  </FlexRow>
                </td>
                <Gw2AccountBodyCells requiredScopes={requiredScopes} noDataTable>
                  <RaidClearCell accountId={null as never} eventId={event.id}/>
                </Gw2AccountBodyCells>
              </tr>
            ))}
          </tbody>
        )))}
      </Table>
    </>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { language } = await params;
  const t = getTranslate(language);

  return {
    title: t('raids'),
    description: t('raids.description'),
    keywords: ['raid', 'wing', 'instance', 'PvE', 'group', 'squad', 'weekly', 'emboldened', 'call of the mists', 'clear', 'completion'],
  };
}
