import type { AchievementFlags as ApiAchievementFlags } from '@gw2api/types/data/achievement';
import { isDefined } from '@gw2treasures/helper/is';
import { Icon } from '@gw2treasures/ui';
import { FlexRow } from '@gw2treasures/ui/components/Layout/FlexRow';
import { Tip } from '@gw2treasures/ui/components/Tip/Tip';
import type { FC } from 'react';

type FlagOrString = ApiAchievementFlags | (string & {});

export interface AchievementFlagsProps {
  flags: FlagOrString[]
}

export const displayedFlags: FlagOrString[] = [
  'Hidden',
  'Daily',
  'Weekly',
  'Monthly',
  'Repeatable',
  'RequiresUnlock',
];

export const AchievementFlags: FC<AchievementFlagsProps> = ({ flags }) => {
  const icons = flags.map((flag) => {
    switch(flag) {
      case 'Hidden': return <Tip tip="Hidden"><Icon icon="eye"/></Tip>;
      case 'Daily': return <Tip tip="Daily"><Icon icon="revision"/></Tip>;
      case 'Weekly': return <Tip tip="Weekly"><Icon icon="revision"/></Tip>;
      case 'Monthly': return <Tip tip="Monthly"><Icon icon="revision"/></Tip>;
      case 'Repeatable': return <Tip tip="Repeatable"><Icon icon="reload"/></Tip>;
      case 'RequiresUnlock': return <Tip tip="Requires Unlock"><Icon icon="lock"/></Tip>;
      default: return null;
    }
  }).filter(isDefined);

  if(icons.length === 0) {
    return null;
  }

  return (
    <FlexRow align="right">
      {icons}
    </FlexRow>
  );
};
