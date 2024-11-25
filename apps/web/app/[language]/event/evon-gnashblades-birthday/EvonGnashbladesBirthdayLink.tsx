import { Icon } from '@gw2treasures/ui';
import Link from 'next/link';
import type { FC } from 'react';

export const EvonGnashbladesBirthdayLink: FC = () => {
  return (
    <div style={{ textAlign: 'center' }}>
      <Link href="/event/evon-gnashblades-birthday" style={{ backgroundColor: '#dacaa1', padding: 16, borderRadius: 2, color: '#000', display: 'inline-flex', gap: 16 }}>
        <span><b>Current Event:</b> Evon Gnashblade’s “Birthday” celebration</span>
        <Icon icon="chevron-right" color="#b7000d"/>
      </Link>
    </div>
  );
};
