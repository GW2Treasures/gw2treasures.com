import type { Skin } from '@gw2treasures/database';
import { createDataTable } from '@gw2treasures/ui/components/Table/DataTable';
import type { FC, ReactNode } from 'react';
import { Trans } from '../I18n/Trans';
import { SkinLink } from './SkinLink';
import type { WithIcon } from '@/lib/with';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { ColumnSelect } from '../Table/ColumnSelect';
import { ItemType } from '../Item/ItemType';
import { translations as itemTypeTranslations, type TypeTranslation } from '@/components/Item/ItemType.translations';
import { translateMany } from '@/lib/translate';
import type { Weight } from '@/lib/types/weight';
import type { LocalizedEntity } from '@/lib/localizedName';
import { Gw2AccountBodyCells, Gw2AccountHeaderCells } from '../Gw2Api/Gw2AccountTableCells';
import { SkinAccountUnlockCell, requiredScopes } from './SkinAccountUnlockCell';
import { FormatNumber } from '../Format/FormatNumber';
import { DropDown } from '@gw2treasures/ui/components/DropDown/DropDown';
import { Button, LinkButton } from '@gw2treasures/ui/components/Form/Button';
import { Icon } from '@gw2treasures/ui';
import { MenuList } from '@gw2treasures/ui/components/Layout/MenuList';
import { CopyButton } from '@gw2treasures/ui/components/Form/Buttons/CopyButton';
import { encode } from 'gw2e-chat-codes';
import type { SubType, Type } from '../Item/ItemType.types';

export interface SkinTableProps {
  skins: WithIcon<Pick<Skin, 'id' | 'rarity' | 'weight' | 'type' | 'subtype' | 'unlocks' | keyof LocalizedEntity>>[]
  headline?: ReactNode;
  headlineId?: string;
}

export const SkinTable: FC<SkinTableProps> = ({ skins, headline, headlineId }) => {
  const Skins = createDataTable(skins, ({ id }) => id);
  const anySkinHasWeight = skins.some(({ weight }) => weight !== null);

  return (
    <>
      {headline && headlineId && (
        <Headline id={headlineId} actions={<ColumnSelect table={Skins}/>}>{headline}</Headline>
      )}

      <Skins.Table>
        <Skins.Column id="id" title={<Trans id="itemTable.column.id"/>} align="right" small hidden sortBy="id">{({ id }) => id}</Skins.Column>
        <Skins.Column id="skin" title="Skin">{(skin) => <SkinLink skin={skin}/>}</Skins.Column>
        <Skins.Column id="type" title={<Trans id="itemTable.column.type"/>} sortBy="type">{(skin) => <ItemType display="long" type={skin.type as Type} subtype={skin.subtype as SubType<Type>} translations={translateMany(itemTypeTranslations.long) as unknown as Record<TypeTranslation<Type, SubType<Type>>, string>}/>}</Skins.Column>
        <Skins.Column id="weight" title="Weight" hidden={!anySkinHasWeight} sortBy="weight">{({ weight }) => weight ? <Trans id={`weight.${weight as Weight}`}/> : <span style={{ color: 'var(--color-text-muted)' }}>-</span>}</Skins.Column>
        <Skins.Column id="unlocks" title="Unlocks" hidden align="right" sortBy="unlocks">{({ unlocks }) => <FormatNumber value={unlocks !== null ? Math.round(unlocks * 1000) / 10 : null} unit="%"/>}</Skins.Column>
        <Skins.DynamicColumns headers={<Gw2AccountHeaderCells requiredScopes={requiredScopes}/>}>
          {({ id }) => (
            <Gw2AccountBodyCells requiredScopes={requiredScopes}>
              <SkinAccountUnlockCell skinId={id} accountId={undefined as never}/>
            </Gw2AccountBodyCells>
          )}
        </Skins.DynamicColumns>
        <Skins.Column id="actions" title="" small fixed>
          {({ id }) => (
            <DropDown button={<Button iconOnly appearance="menu"><Icon icon="more"/></Button>} preferredPlacement="right-start">
              <MenuList>
                <LinkButton appearance="menu" icon="eye" href={`/skin/${id}`}>View Skin</LinkButton>
                <CopyButton appearance="menu" icon="chatlink" copy={encode('skin', id) || ''}><Trans id="chatlink.copy"/></CopyButton>
              </MenuList>
            </DropDown>
          )}
        </Skins.Column>
      </Skins.Table>
    </>
  );
};
