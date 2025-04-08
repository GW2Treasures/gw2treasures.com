import { Icon } from '@gw2treasures/ui';
import Link from 'next/link';
import type { FC } from 'react';

export const DungeonRushLink: FC = () => {
  return (
    <div style={{ textAlign: 'center' }}>
      <Link href="/dungeons" style={{ backgroundColor: 'light-dark(#b8ffd6, #1c5133)', padding: 16, borderRadius: 2, color: 'light-dark(#000, #fff)', display: 'inline-flex', gap: 8, lineHeight: 1.5, alignItems: 'center' }}>
        <Icon icon="story"/>
        <span><b>Current Event:</b> Dungeon Rush</span>
        <Icon icon="chevron-right" color="light-dark(#1c5133, #b8ffd6)"/>
      </Link>
    </div>
  );
};
