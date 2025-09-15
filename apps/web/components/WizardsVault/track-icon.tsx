import type { WizardsVaultTrack } from '@gw2treasures/database';
import { Icon, type IconName, type IconProps } from '@gw2treasures/ui';
import type { FC } from 'react';

export interface WizardsVaultTrackIconProps extends Omit<IconProps, 'icon'> {
  track: WizardsVaultTrack,
}

export const WizardsVaultTrackIcon: FC<WizardsVaultTrackIconProps> = ({ track, ...props }) => {
  return (
    <Icon icon={trackIcons[track]} {...props}/>
  );
};

const trackIcons: Record<WizardsVaultTrack, IconName> = {
  'PvE': 'tyria',
  'PvP': 'pvp',
  'WvW': 'wvw-keep',
};
