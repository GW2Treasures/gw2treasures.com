import type { CSSProperties, FC } from 'react';
import { Icon, type IconName } from '@gw2treasures/ui';
import { Tip } from '@gw2treasures/ui/components/Tip/Tip';

export type Discipline = 'Armorsmith' | 'Artificer' | 'Chef' | 'Huntsman' | 'Jeweler' | 'Leatherworker' | 'Scribe' | 'Tailor' | 'Weaponsmith';

export interface DisciplineIconProps {
  discipline: Discipline;
};

const DisciplieIcons: Record<Discipline, { icon: IconName, color: CSSProperties['--icon-color'] }> = {
  'Armorsmith': { icon: 'armorsmith', color: '#607d8b' },
  'Artificer': { icon: 'artificer', color: '#ff6f00' },
  'Chef': { icon: 'chef', color: '#2196f3' },
  'Huntsman': { icon: 'huntsman', color: '#4caf50' },
  'Jeweler': { icon: 'jeweler', color: '#9c27b0' },
  'Leatherworker': { icon: 'leatherworker', color: '#795548' },
  'Scribe': { icon: 'scribe', color: '#3f51b5' },
  'Tailor': { icon: 'tailor', color: '#9e9e9e' },
  'Weaponsmith': { icon: 'weaponsmith', color: '#794848' },
};

export const DisciplineIcon: FC<DisciplineIconProps> = ({ discipline }) => {
  const { icon, color } = DisciplieIcons[discipline];

  return (
    <Tip tip={discipline}>
      <Icon icon={icon} color={color}/>
    </Tip>
  );
};
