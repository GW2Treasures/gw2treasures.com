import type { Skin } from '@gw2treasures/database';
import { createDataTable } from '@gw2treasures/ui/components/Table/DataTable';
import type { FC, ReactNode } from 'react';
import { Trans } from '../I18n/Trans';
import { SkinLink } from './SkinLink';
import type { WithIcon } from '@/lib/with';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { ColumnSelect } from '../Table/ColumnSelect';
import { ItemType } from '../Item/ItemType';
import { translations as itemTypeTranslations } from '@/components/Item/ItemType.translations';
import { translateMany } from '@/lib/translate';
import type { Weight } from '@/lib/types/weight';
import type { LocalizedEntity } from '@/lib/localizedName';

export interface SkinTableProps {
  skins: WithIcon<Pick<Skin, 'id' | 'rarity' | 'weight' | 'type' | 'subtype' | keyof LocalizedEntity>>[]
  headline?: ReactNode;
  headlineId?: string;
}

export const SkinTable: FC<SkinTableProps> = ({ skins, headline, headlineId }) => {
  const Skins = createDataTable(skins, ({ id }) => id);
  const anySkinHasWeight = skins.some(({ weight }) => weight !== null);

  return (
    <>
      {headline && headlineId && (
        <Headline id="" actions={<ColumnSelect table={Skins}/>}>{headline}</Headline>
      )}

      <Skins.Table>
        <Skins.Column id="id" title={<Trans id="itemTable.column.id"/>} align="right" small hidden>{({ id }) => id}</Skins.Column>
        <Skins.Column id="skin" title="Skin">{(skin) => <SkinLink skin={skin}/>}</Skins.Column>
        <Skins.Column id="type" title={<Trans id="itemTable.column.type"/>}>{(skin) => <ItemType display="long" type={skin.type as any} subtype={skin.subtype as any} translations={translateMany(itemTypeTranslations.long)}/>}</Skins.Column>
        <Skins.Column id="weight" title="Weight" hidden={!anySkinHasWeight}>{({ weight }) => weight ? <Trans id={`weight.${weight as Weight}`}/> : <span style={{ color: 'var(--color-text-muted)' }}>-</span>}</Skins.Column>
      </Skins.Table>
    </>
  );
};
