import type { MasteryRegion } from '@gw2treasures/database';
import type { FC } from 'react';
import type * as CSS from 'csstype';
import { Trans } from '../I18n/Trans';

export const MasteryColors: Record<MasteryRegion, CSS.Property.Color> = {
  Tyria: '#FB8C00', // core
  Maguuma: '#43A047', // HoT
  Desert: '#D81B60', // PoF
  Tundra: '#00ACC1', // Icebrood
  Jade: '#1E88E5', // EoD
  Sky: '#F3D71F', // SotO
  Unknown: 'currentColor',
};

export interface MasteryProps {
  mastery: MasteryRegion,
}

export const Mastery: FC<MasteryProps> = ({ mastery }) => {
  return (
    <Trans id={`mastery.${mastery}`}/>
  );
};
