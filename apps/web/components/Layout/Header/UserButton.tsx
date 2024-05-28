import { getUser, type SessionUser } from '@/lib/getUser';
import { Icon } from '@gw2treasures/ui';
import { LinkButton } from '@gw2treasures/ui/components/Form/Button';
import { Suspense, type FC } from 'react';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import styles from '../Layout.module.css';
import 'server-only';
import { Trans } from '@/components/I18n/Trans';
import { getTranslate } from '@/lib/translate';
import { DropDown } from '@gw2treasures/ui/components/DropDown/DropDown';
import { MenuList } from '@gw2treasures/ui/components/Layout/MenuList';
import { Separator } from '@gw2treasures/ui/components/Layout/Separator';
import { SubmitButton } from '@gw2treasures/ui/components/Form/Buttons/SubmitButton';
import { reauthorize } from '@/components/Gw2Api/reauthorize';
import { UserButtonAccounts } from './UserButtonAccounts';
import type { Language } from '@gw2treasures/database';


// exported suspended wrapper around the actual button

export interface UserButtonProps {
  language: Language;
}

export const UserButton: FC<UserButtonProps> = ({ language }) => {
  return (
    <Suspense fallback={<UserButtonButton language={language} user="loading"/>}>
      <UserButtonLoader language={language}/>
    </Suspense>
  );
};


// internal component to load the user

const UserButtonLoader: FC<UserButtonProps> = async ({ language }) => {
  const user = await getUser();

  return <UserButtonButton user={user} language={language}/>;
};


// internal button component to show loader / user / login

interface UserButtonButtonProps {
  user?: SessionUser | 'loading'
  language: Language;
}
const UserButtonButton: FC<UserButtonButtonProps> = ({ user, language }) => {
  const t = getTranslate(language);

  if(!user) {
    return (
      <LinkButton appearance="menu" href="/login" aria-label={t('login')}>
        <Icon icon="user"/><span className={styles.responsive}> <Trans id="login" language={language}/></span>
      </LinkButton>
    );
  }

  const button = (
    <LinkButton appearance="menu" href="/profile" aria-label={user === 'loading' ? undefined : user.name}>
      <Icon icon="user"/><span className={styles.responsive}> {user === 'loading' ? <Skeleton width={90}/> : user.name}</span>
    </LinkButton>
  );

  return (
    <DropDown hideTop={false} button={button} preferredPlacement="bottom">
      <MenuList>
        <LinkButton appearance="menu" href="/profile" icon="user">Profile</LinkButton>
        {user !== 'loading' && user.roles.includes('Admin') && (
          <LinkButton icon="developer" appearance="menu" href="/admin/users">Admin</LinkButton>
        )}
        <LinkButton appearance="menu" external href="/logout" icon="logout">Logout</LinkButton>
        <Separator/>
        <form action={reauthorize.bind(null, [], 'consent')}>
          <SubmitButton icon="gw2me-outline" appearance="menu">Manage Accounts</SubmitButton>
        </form>
        <UserButtonAccounts/>
      </MenuList>
    </DropDown>
  );
};
