import type { FC, ReactNode } from 'react';
import { useUser } from './use-user';
import { Icon } from '@gw2treasures/ui';

export interface CookieNotificationProps { }

export const CookieNotification: FC<CookieNotificationProps> = ({ }) => {
  const { user } = useUser();

  if(user) {
    return;
  }

  return (
    <div style={{ display: 'flex', gap: 12, padding: '4px 16px', maxWidth: 264, minWidth: '100%', alignItems: 'center', background: 'var(--color-background-light)', border: '1px solid var(--color-border-dark)', lineHeight: 1.5, marginBottom: 8, borderRadius: 2 }}>
      <Icon icon="cookie"/>
      Changing settings will store cookies in your browser
    </div>
  );
};
