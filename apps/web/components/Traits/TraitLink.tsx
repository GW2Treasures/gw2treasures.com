import type { FC, ReactNode } from 'react';
import type { Trait, Language } from '@gw2treasures/database';
import type { IconSize } from '@/lib/getIconUrl';
import { EntityLink } from '../Link/EntityLink';
import type { WithIcon } from '@/lib/with';
import { type LocalizedEntity } from '@/lib/localizedName';

export interface TraitLinkProps {
  trait: WithIcon<LocalizedEntity> & Pick<Trait, 'id'>,
  icon?: IconSize | 'none',
  language?: Language,
  children?: ReactNode,
}

export const TraitLink: FC<TraitLinkProps> = ({ trait, icon = 32, ...props }) => {
  return <EntityLink href={`/traits/${trait.id}`} entity={trait} icon={icon} {...props}/>;
};
