import type { CSSProperties, FC } from 'react';
import { Icon, type IconName } from '@gw2treasures/ui';
import { Tip } from '@gw2treasures/ui/components/Tip/Tip';
import type { CraftingDiscipline } from '@gw2api/types/data/recipe';
import { Trans } from '../I18n/Trans';

export interface DisciplineIconProps {
  discipline: CraftingDiscipline,
}

const DisciplineIcons: Record<CraftingDiscipline, { icon: IconName, color: CSSProperties['--icon-color'] }> = {
  Armorsmith: { icon: 'armorsmith', color: 'light-dark( #607d8b, #607d8b)' },
  Artificer: { icon: 'artificer', color: 'light-dark( #f57c00, #a1887f)' },
  Chef: { icon: 'chef', color: 'light-dark( #1976d2, #64b5f6)' },
  Homesteader: { icon: 'homestead', color: 'light-dark( #d32f2f, #e57373)' },
  Huntsman: { icon: 'huntsman', color: 'light-dark( #558b2f, #8bc34a)' },
  Jeweler: { icon: 'jeweler', color: 'light-dark( #9c27b0, #ba68c8)' },
  Leatherworker: { icon: 'leatherworker', color: 'light-dark( #ff5722, #ff8a65)' },
  Scribe: { icon: 'scribe', color: 'light-dark( #3f51b5, #7986cb)' },
  Tailor: { icon: 'tailor', color: 'light-dark( #757575, #9e9e9e)' },
  Weaponsmith: { icon: 'weaponsmith', color: 'light-dark( #795548, #a1887f)' },
};

export const DisciplineIcon: FC<DisciplineIconProps> = ({ discipline }) => {
  const { icon, color } = DisciplineIcons[discipline] ?? { icon: 'info', color: 'currentColor' };

  return (
    <Tip tip={<Trans id={`discipline.${discipline}`}/>}>
      <Icon icon={icon} color={color}/>
    </Tip>
  );
};
