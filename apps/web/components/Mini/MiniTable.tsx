import type { Mini } from '@gw2treasures/database';
import { createDataTable } from '@gw2treasures/ui/components/Table/DataTable';
import type { FC, ReactNode } from 'react';
import { Trans } from '../I18n/Trans';
import { MiniLink } from './MiniLink';
import type { WithIcon } from '@/lib/with';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { ColumnSelect } from '../Table/ColumnSelect';
import type { LocalizedEntity } from '@/lib/localizedName';
import { Gw2AccountBodyCells, Gw2AccountHeaderCells } from '../Gw2Api/Gw2AccountTableCells';
import { MiniAccountUnlockCell, requiredScopes } from './MiniAccountUnlockCell';
import { DropDown } from '@gw2treasures/ui/components/DropDown/DropDown';
import { Button, LinkButton } from '@gw2treasures/ui/components/Form/Button';
import { Icon } from '@gw2treasures/ui';
import { MenuList } from '@gw2treasures/ui/components/Layout/MenuList';

export interface MiniTableProps {
  minis: WithIcon<Pick<Mini, 'id' | keyof LocalizedEntity>>[]
  headline?: ReactNode;
  headlineId?: string;
}

export const MiniTable: FC<MiniTableProps> = ({ minis, headline, headlineId }) => {
  const Minis = createDataTable(minis, ({ id }) => id);

  return (
    <>
      {headline && headlineId && (
        <Headline id={headlineId} actions={<ColumnSelect table={Minis}/>}>{headline}</Headline>
      )}

      <Minis.Table>
        <Minis.Column id="id" title={<Trans id="itemTable.column.id"/>} align="right" small hidden sortBy="id">{({ id }) => id}</Minis.Column>
        <Minis.Column id="mini" title="Mini">{(mini) => <MiniLink mini={mini}/>}</Minis.Column>
        {/* <Minis.Column id="unlocks" title="Unlocks" hidden align="right" sortBy="unlocks">{({ unlocks }) => <FormatNumber value={unlocks !== null ? Math.round(unlocks * 1000) / 10 : null} unit="%"/>}</Minis.Column> */}
        <Minis.DynamicColumns headers={<Gw2AccountHeaderCells requiredScopes={requiredScopes} small/>}>
          {({ id }) => (
            <Gw2AccountBodyCells requiredScopes={requiredScopes}>
              <MiniAccountUnlockCell miniId={id} accountId={undefined as never}/>
            </Gw2AccountBodyCells>
          )}
        </Minis.DynamicColumns>
        <Minis.Column id="actions" title="" small fixed>
          {({ id }) => (
            <DropDown button={<Button iconOnly appearance="menu"><Icon icon="more"/></Button>} preferredPlacement="right-start">
              <MenuList>
                <LinkButton appearance="menu" icon="eye" href={`/minis/${id}`}>View Mini</LinkButton>
              </MenuList>
            </DropDown>
          )}
        </Minis.Column>
      </Minis.Table>
    </>
  );
};
