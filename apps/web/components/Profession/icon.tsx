import type { Profession } from '@gw2api/types/data/profession';
import { Icon, type IconProps } from '@gw2treasures/ui';
import type { FC } from 'react';


const icons: Record<Profession.Id, Pick<IconProps, 'icon' | 'color'>> = {
  Elementalist: { icon: 'elementalist', color: 'light-dark( #c62828, #e57373)' },
  Engineer: { icon: 'engineer', color: 'light-dark( #d84315, #ff8a65)' },
  Guardian: { icon: 'guardian', color: 'light-dark( #00838f, #4dd0e1)' },
  Mesmer: { icon: 'mesmer', color: 'light-dark( #9c27b0, #ba68c8)' },
  Necromancer: { icon: 'necromancer', color: 'light-dark( #00695c, #81c784)' },
  Ranger: { icon: 'ranger', color: 'light-dark( #558b2f, #aed581)' },
  Revenant: { icon: 'revenant', color: 'light-dark( #ad1457, #f06292)' },
  Thief: { icon: 'thief', color: 'light-dark( #b23724, #f06292)' },
  Warrior: { icon: 'warrior', color: 'light-dark( #f57f17, #fff176)' },
};


export interface ProfessionIconProps {
  profession: Profession.Id,
  className?: string,
}

export const ProfessionIcon: FC<ProfessionIconProps> = ({ profession, className }) => {
  const props = icons[profession];

  return (
    <Icon {...props} className={className}/>
  );
};

export function getProfessionColor(profession: Profession.Id | undefined) {
  return profession
    ? icons[profession].color
    : undefined;
}
