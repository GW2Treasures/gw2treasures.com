import { Waypoint } from '@/components/Waypoint/Waypoint';
import { Table } from '@gw2treasures/ui/components/Table/Table';
import { type FC } from 'react';
import { HologramStampedeNextTimer } from './hologram-stampede-timer.client';
import { Trans } from '@/components/I18n/Trans';

export const HologramStampedeTimer: FC = () => {
  const scheduleMinutes = (
    <span style={{ color: 'var(--color-text-muted)' }}>xx</span>
  );

  const active = (
    <Trans id="festival.dragon-bash.hologram-stampede.active"/>
  );

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
          <td style={tnum}><HologramStampedeNextTimer schedule={0} active={active}/></td>
        </tr>
        <tr>
          <th><Trans id="festival.dragon-bash.hologram-stampede.zone.dredgehauntCliffs"/></th>
          <td><Waypoint id={611}/></td>
          <td style={tnum}>{scheduleMinutes}:15</td>
          <td style={tnum}><HologramStampedeNextTimer schedule={15} active={active}/></td>
        </tr>
        <tr>
          <th><Trans id="festival.dragon-bash.hologram-stampede.zone.lornarsPass"/></th>
          <td><Waypoint id={409}/></td>
          <td style={tnum}>{scheduleMinutes}:30</td>
          <td style={tnum}><HologramStampedeNextTimer schedule={30} active={active}/></td>
        </tr>
        <tr>
          <th><Trans id="festival.dragon-bash.hologram-stampede.zone.snowdenDrifts"/></th>
          <td><Waypoint id={187}/></td>
          <td style={tnum}>{scheduleMinutes}:45</td>
          <td style={tnum}><HologramStampedeNextTimer schedule={45} active={active}/></td>
        </tr>
      </tbody>
    </Table>
  );
};
