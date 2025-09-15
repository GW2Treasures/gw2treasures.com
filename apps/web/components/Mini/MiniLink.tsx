import type { FC } from 'react';
import type { Language, Mini } from '@gw2treasures/database';
import type { IconSize } from '@/lib/getIconUrl';
import { EntityLink } from '../Link/EntityLink';
import type { WithIcon } from '@/lib/with';
import type { LocalizedEntity } from '@/lib/localizedName';
import { getLinkProperties } from '@/lib/linkProperties';
import { Tooltip } from '../Tooltip/Tooltip';
import { MiniLinkTooltip } from './MiniLinkTooltip';

export interface MiniLinkProps {
  mini: WithIcon<Pick<Mini, 'id' | keyof LocalizedEntity>>,
  icon?: IconSize | 'none',
  language?: Language,
}

export const MiniLink: FC<MiniLinkProps> = ({ mini, icon = 32, language }) => {
  const entity = getLinkProperties(mini);

  return (
    <Tooltip content={<MiniLinkTooltip mini={entity} language={language}/>}>
      <EntityLink href={`/minis/${mini.id}`} entity={mini} icon={icon} language={language}/>
    </Tooltip>
  );
};
