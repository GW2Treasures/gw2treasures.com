import { type AnchorHTMLAttributes, type FC, type ReactElement, type ReactNode } from 'react';
import type { Language, Rarity } from '@gw2treasures/database';
import type { IconSize } from '@/lib/getIconUrl';
import type { LocalizedEntity } from '@/lib/localizedName';
import type { WithIcon } from '@/lib/with';
import { EntityLinkInternal } from './EntityLinkInternal';
import { getLinkProperties } from '@/lib/linkProperties';
import type { EntityIconType } from '../Entity/EntityIcon';
import type { RefProp } from '@gw2treasures/ui/lib/react';

interface CustomEntityLinkProps extends RefProp<HTMLAnchorElement> {
  href: string,
  entity: WithIcon<LocalizedEntity> & ({ id: unknown, rarity: Rarity } | { id: unknown }),
  icon?: IconSize | 'none' | ReactElement,
  iconType?: EntityIconType,
  language?: Language,
  onClick?: React.MouseEventHandler<HTMLAnchorElement>,
  children?: ReactNode,
}

export type EntityLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof CustomEntityLinkProps> & CustomEntityLinkProps;

export const EntityLink: FC<CustomEntityLinkProps> = ({ ref, entity, ...props }) => {
  const cleanEntity = getLinkProperties(entity);

  return (
    <EntityLinkInternal ref={ref} entity={cleanEntity} {...props}/>
  );
};
