import { forwardRef, ReactElement } from 'react';
import { Language } from '@prisma/client';
import { IconSize } from '@/lib/getIconUrl';
import { LocalizedEntity } from '@/lib/localizedName';
import { WithIcon } from '@/lib/with';
import { EntityLinkInternal } from './EntityLinkInternal';
import { getLinkProperties } from '@/lib/linkProperties';

export interface EntityLinkProps {
  href: string;
  entity: WithIcon<LocalizedEntity> & { rarity?: string };
  icon?: IconSize | 'none' | ReactElement;
  language?: Language;
}

export const EntityLink = forwardRef<HTMLAnchorElement, EntityLinkProps>(function EntityLink({ entity, ...props }, ref) {
  const cleanEntity = getLinkProperties(entity);

  return (
    <EntityLinkInternal ref={ref} entity={cleanEntity} {...props}/>
  );
});
