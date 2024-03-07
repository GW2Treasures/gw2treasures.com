import { getUser, type SessionUser } from '@/lib/getUser';
import { Icon } from '@gw2treasures/ui';
import { LinkButton } from '@gw2treasures/ui/components/Form/Button';
import { Suspense, type FC } from 'react';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import styles from '../Layout.module.css';
import 'server-only';
import { Trans } from '@/components/I18n/Trans';


// exported suspended wrapper around the actual button

export interface UserButtonProps {}

export const UserButton: FC<UserButtonProps> = () => {
  return (
    <Suspense fallback={<UserButtonButton user="loading"/>}>
      <UserButtonLoader/>
    </Suspense>
  );
};


// internal component to load the user

const UserButtonLoader: FC<UserButtonProps> = async ({}) => {
  const user = await getUser();

  return <UserButtonButton user={user}/>;
};


// internal button component to show loader / user / login

interface UserButtonButtonProps {
  user?: SessionUser | 'loading'
}
const UserButtonButton: FC<UserButtonButtonProps> = ({ user }) => {
  return (
    <LinkButton appearance="menu" href={user ? '/profile' : '/login'}>
      <Icon icon="user"/><span className={styles.responsive}> {user === 'loading' ? <Skeleton width={90}/> : user ? user.name : <Trans id="login"/>}</span>
    </LinkButton>
  );
};
