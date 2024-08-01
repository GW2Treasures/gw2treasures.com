import { type AnchorHTMLAttributes, forwardRef, type ReactElement } from 'react';
import type { Language, Rarity } from '@gw2treasures/database';
import type { IconSize } from '@/lib/getIconUrl';
import type { LocalizedEntity } from '@/lib/localizedName';
import type { WithIcon } from '@/lib/with';
import { EntityLinkInternal } from './EntityLinkInternal';
import { getLinkProperties } from '@/lib/linkProperties';
import type { EntityIconType } from '../Entity/EntityIcon';

interface CustomEntityLinkProps {
  href: string;
  entity: WithIcon<LocalizedEntity> & ({ id: unknown, rarity: Rarity } | { id: unknown });
  icon?: IconSize | 'none' | ReactElement;
  iconType?: EntityIconType;
  language?: Language;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

export type EntityLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof CustomEntityLinkProps> & CustomEntityLinkProps;

export const EntityLink = forwardRef<HTMLAnchorElement, EntityLinkProps>(function EntityLink({ entity, ...props }, ref) {
  const cleanEntity = getLinkProperties(entity);

  return (
    <EntityLinkInternal ref={ref} entity={cleanEntity} {...props}/>
  );
});
