import { FC, ReactElement } from 'react';
import { Language } from '@prisma/client';
import { IconSize } from '@/lib/getIconUrl';
import { LocalizedEntity } from '@/lib/localizedName';
import { WithIcon } from '@/lib/with';
import { EntityLinkInternal } from './EntityLinkInternal';

export interface EntityLinkProps {
  href: string;
  entity: WithIcon<LocalizedEntity> & { rarity?: string };
  icon?: IconSize | 'none' | ReactElement;
  language?: Language;
}

export const EntityLink: FC<EntityLinkProps> = ({ entity: { name_de, name_en, name_es, name_fr, icon, rarity }, ...props }) => {
  const cleanEntity: EntityLinkProps['entity'] = { name_de, name_en, name_es, name_fr, icon, rarity };

  return (
    <EntityLinkInternal entity={cleanEntity} {...props}/>
  );
};
