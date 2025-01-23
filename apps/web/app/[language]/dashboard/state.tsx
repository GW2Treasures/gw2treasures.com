import { type FC, type ReactNode } from 'react';
import { useUser } from '@/components/User/use-user';
import { useGw2Accounts } from '@/components/Gw2Api/use-gw2-accounts';
import { reauthorize } from '@/components/Gw2Api/reauthorize';
import { LinkButton } from '@gw2treasures/ui/components/Form/Button';
import { SubmitButton } from '@gw2treasures/ui/components/Form/Buttons/SubmitButton';
import { Icon, type IconProp } from '@gw2treasures/ui';
import styles from './dashboard.module.css';
import type { Scope } from '@gw2me/client';
import { useHydrated } from '@/lib/useHydrated';

interface StateProps {
  requiredScopes: Scope[];
}

export const State: FC<StateProps> = ({ requiredScopes }) => {
  const user = useUser();
  const accounts = useGw2Accounts(requiredScopes);
  const hydrated = useHydrated();

  const loginUrl = hydrated
    ? `/login?returnTo=${encodeURIComponent(location.pathname + location.search)}&scopes=${encodeURIComponent(requiredScopes.join(','))}`
    : '/login';

  if(!user) {
    return <EmptyState action={<LinkButton href={loginUrl} icon="user">Login</LinkButton>}>You need to log in to see your accounts.</EmptyState>;
  }

  if(accounts.loading) {
    return <EmptyState icon="loading">Loading accounts...</EmptyState>;
  }

  if(accounts.error) {
    return <EmptyState icon="warning">Error loading accounts.</EmptyState>;
  }

  if(!requiredScopes.every((scope) => accounts.scopes.includes(scope))) {
    return <EmptyState action={<form action={reauthorize.bind(null, requiredScopes, undefined)}><SubmitButton icon="gw2me-outline">Authorize</SubmitButton></form>}>Authorize gw2treasures.com to access your Guild Wars 2 accounts.</EmptyState>;
  }

  return null;
};

interface EmptyStateProps {
  children: ReactNode,
  icon?: IconProp,
  action?: ReactNode,
}

export const EmptyState: FC<EmptyStateProps> = ({ children, icon, action }) => {
  return (
    <div className={styles.emptyState}>
      {icon && (<Icon icon={icon}/>)}
      {children}
      {action}
    </div>
  );
};
