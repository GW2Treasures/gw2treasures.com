import type { FC, ReactNode } from 'react';
import type { Trait, Language } from '@gw2treasures/database';
import type { IconSize } from '@/lib/getIconUrl';
import { EntityLink } from '../Link/EntityLink';
import type { WithIcon } from '@/lib/with';
import { type LocalizedEntity } from '@/lib/localizedName';
import { Tooltip } from '../Tooltip/Tooltip';
import { getLinkProperties } from '@/lib/linkProperties';
import { TraitLinkTooltip } from './TraitLinkTooltip';

export interface TraitLinkProps {
  trait: WithIcon<LocalizedEntity> & Pick<Trait, 'id' | 'slot'>,
  revision?: string,
  icon?: IconSize | 'none',
  language?: Language,
  children?: ReactNode,
}

export const TraitLink: FC<TraitLinkProps> = ({ trait, revision, icon = 32, language, ...props }) => {
  const entity = { ...getLinkProperties(trait), slot: trait.slot };

  return (
    <Tooltip content={<TraitLinkTooltip trait={entity} language={language} revision={revision}/>}>
      <EntityLink href={`/traits/${trait.id}`} entity={entity} icon={icon} language={language} iconType={trait.slot === 'Major' ? 'trait-major' : 'trait-minor'} {...props}/>
    </Tooltip>
  );
};
