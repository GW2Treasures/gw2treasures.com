import type { FC } from 'react';
import type { Specialization, Language } from '@gw2treasures/database';
import type { IconSize } from '@/lib/getIconUrl';
import { EntityLink } from '../Link/EntityLink';
import type { WithIcon } from '@/lib/with';
import { type LocalizedEntity } from '@/lib/localizedName';

export interface SpecializationLinkProps {
  specialization: WithIcon<LocalizedEntity> & Pick<Specialization, 'id' | 'professionId'>,
  icon?: IconSize | 'none',
  language?: Language,
}

export const SpecializationLink: FC<SpecializationLinkProps> = ({ specialization, icon = 32, language }) => {
  return <EntityLink href={`/professions/${specialization.professionId}#${specialization.id}`} entity={specialization} icon={icon} language={language}/>;
};
