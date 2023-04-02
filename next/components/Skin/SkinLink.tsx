import { FC } from 'react';
import { Language, Skin } from '@prisma/client';
import { IconSize } from '@/lib/getIconUrl';
import { EntityLink } from '../Link/EntityLink';
import { WithIcon } from '../../lib/with';
import { LocalizedEntity } from '@/lib/localizedName';
import { getLinkProperties } from '@/lib/linkProperties';
import { Tooltip } from '../Tooltip/Tooltip';
import { SkinLinkTooltip } from './SkinLinkTooltip';

export interface SkinLinkProps {
  skin: WithIcon<Pick<Skin, 'id' | 'rarity' | keyof LocalizedEntity>>;
  icon?: IconSize | 'none';
  language?: Language;
}

export const SkinLink: FC<SkinLinkProps> = ({ skin, icon = 32, language }) => {
  const entity = getLinkProperties(skin);

  return (
    <Tooltip content={<SkinLinkTooltip item={entity} language={language}/>}>
      <EntityLink href={`/skin/${skin.id}`} entity={skin} icon={icon} language={language}/>
    </Tooltip>
  );
};
