import { AnchorHTMLAttributes, forwardRef, ReactElement } from 'react';
import { Language } from '@gw2treasures/database';
import { IconSize } from '@/lib/getIconUrl';
import { LocalizedEntity } from '@/lib/localizedName';
import { WithIcon } from '@/lib/with';
import { EntityLinkInternal } from './EntityLinkInternal';
import { getLinkProperties } from '@/lib/linkProperties';
import { EntityIconType } from '../Entity/EntityIcon';

interface CustomEntityLinkProps {
  href: string;
  entity: WithIcon<LocalizedEntity> & { rarity?: string };
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
