import { FC } from 'react';
import { EntityIcon, EntityIconProps } from '../Entity/EntityIcon';

export const SkillIcon: FC<Omit<EntityIconProps, 'type'>> = ({ icon, size = 64, className }) => {
  return (
    <EntityIcon icon={icon} size={size} className={className} type="skill"/>
  );
};
