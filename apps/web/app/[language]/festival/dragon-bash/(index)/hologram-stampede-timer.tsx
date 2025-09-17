import { Waypoint } from '@/components/Waypoint/Waypoint';
import { Table } from '@gw2treasures/ui/components/Table/Table';
import { type FC } from 'react';
import { Trans } from '@/components/I18n/Trans';
import { CountDown } from '@/components/Time/countdown';

export const HologramStampedeTimer: FC = () => {
  const scheduleMinutes = (
    <span style={{ color: 'var(--color-text-muted)' }}>xx</span>
  );

  const active = (
    <strong><Trans id="festival.dragon-bash.hologram-stampede.active"/></strong>
  );

  const countdownConfig = {
    activeDurationMinutes: 5,
    highlightNextMinutes: 10,
    active,
  };

  const tnum = { fontFeatureSettings: '"tnum"' };

  return (
    <Table width="auto">
      <thead>
        <tr>
          <th colSpan={2}><Trans id="festival.dragon-bash.hologram-stampede.zone"/></th>
          <th><Trans id="festival.dragon-bash.hologram-stampede.schedule"/></th>
          <th><Trans id="festival.dragon-bash.hologram-stampede.next"/></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th><Trans id="festival.dragon-bash.hologram-stampede.zone.wayfarerFoothills"/></th>
          <td><Waypoint id={381}/></td>
          <td style={tnum}>{scheduleMinutes}:00</td>
          <td style={tnum}><CountDown schedule={{ offset: 0, repeat: 60 }} {...countdownConfig}/></td>
        </tr>
        <tr>
          <th><Trans id="festival.dragon-bash.hologram-stampede.zone.dredgehauntCliffs"/></th>
          <td><Waypoint id={611}/></td>
          <td style={tnum}>{scheduleMinutes}:15</td>
          <td style={tnum}><CountDown schedule={{ offset: 15, repeat: 60 }} {...countdownConfig}/></td>
        </tr>
        <tr>
          <th><Trans id="festival.dragon-bash.hologram-stampede.zone.lornarsPass"/></th>
          <td><Waypoint id={409}/></td>
          <td style={tnum}>{scheduleMinutes}:30</td>
          <td style={tnum}><CountDown schedule={{ offset: 30, repeat: 60 }} {...countdownConfig}/></td>
        </tr>
        <tr>
          <th><Trans id="festival.dragon-bash.hologram-stampede.zone.snowdenDrifts"/></th>
          <td><Waypoint id={187}/></td>
          <td style={tnum}>{scheduleMinutes}:45</td>
          <td style={tnum}><CountDown schedule={{ offset: 45, repeat: 60 }} {...countdownConfig}/></td>
        </tr>
      </tbody>
    </Table>
  );
};
