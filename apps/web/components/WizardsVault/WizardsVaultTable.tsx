import type { WizardsVaultObjective as Objective } from '@gw2treasures/database';
import type { FC, ReactNode } from 'react';
import { WizardsVaultObjectiveTableProgressCell } from './WizardsVaultObjectiveTable';
import { localizedName } from '@/lib/localizedName';
import { AstralAcclaim } from '../Format/AstralAcclaim';
import { createDataTable } from '@gw2treasures/ui/components/Table/DataTable';
import { Trans } from '../I18n/Trans';
import { getLanguage } from '@/lib/translate';
import { Gw2AccountBodyCells, Gw2AccountHeaderCells } from '../Gw2Api/Gw2AccountTableCells';
import { Scope } from '@gw2me/client';
import { ColumnSelect } from '../Table/ColumnSelect';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';

export interface WizardsVaultTableProps {
  objectives: Objective[],
  headline?: ReactNode,
  headlineId?: string,
  children?: (table: ReactNode, columnSelect: ReactNode) => ReactNode,
}

const requiredScopes = [Scope.GW2_Account, Scope.GW2_Progression];

export const WizardsVaultTable: FC<WizardsVaultTableProps> = async ({ objectives, headline, headlineId, children }) => {
  const language = await getLanguage();
  const Objectives = createDataTable(objectives, ({ id }) => id);

  // TODO: add waypoint column?
  // TODO: add track? this component is usually just used for special objectives anyway…

  const table = (
    <Objectives.Table>
      <Objectives.Column id="id" title={<Trans id="itemTable.column.id"/>} align="right" small hidden sortBy="id">{({ id }) => id}</Objectives.Column>
      <Objectives.Column id="objective" title={<Trans id="wizards-vault.objective"/>}>{(objective) => localizedName(objective, language)}</Objectives.Column>
      <Objectives.Column id="acclaim" title={<Trans id="wizards-vault.astral-acclaim"/>} align="right" sortBy="acclaim">{({ acclaim }) => <AstralAcclaim value={acclaim}/>}</Objectives.Column>
      <Objectives.DynamicColumns id="account-unlock" title={<Trans id="wizards-vault.progress"/>} headers={<Gw2AccountHeaderCells requiredScopes={requiredScopes} small/>}>
        {({ id }) => (
          <Gw2AccountBodyCells requiredScopes={requiredScopes}>
            <WizardsVaultObjectiveTableProgressCell objectiveId={id} accountId={undefined as never}/>
          </Gw2AccountBodyCells>
        )}
      </Objectives.DynamicColumns>
    </Objectives.Table>
  );

  const columnSelect = (<ColumnSelect table={Objectives}/>);

  if(children) {
    return children(table, columnSelect);
  }

  return (
    <>
      {headline && headlineId && (<Headline id={headlineId} actions={columnSelect}>{headline}</Headline>)}
      {table}
    </>
  );
};
