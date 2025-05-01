'use client';

import { useFedCM } from '@/components/gw2me/fedcm-context';
import { useGw2MeClient } from '@/components/gw2me/gw2me-context';
import { Scope } from '@gw2me/client';
import { SubmitButton } from '@gw2treasures/ui/components/Form/Buttons/SubmitButton';
import { useCallback, useEffect, useState, type FC, type FormEventHandler } from 'react';
import { redirectToGw2Me } from './login.action';
import styles from './page.module.css';
import { Checkbox } from '@gw2treasures/ui/components/Form/Checkbox';

const fullScopes = [
  Scope.Identify,
  Scope.Accounts,
  Scope.Accounts_DisplayName,
  Scope.GW2_Account,
  Scope.GW2_Inventories,
  Scope.GW2_Characters,
  Scope.GW2_Tradingpost,
  Scope.GW2_Wallet,
  Scope.GW2_Unlocks,
  // Scope.GW2_Pvp,
  // Scope.GW2_Wvw,
  // Scope.GW2_Builds,
  Scope.GW2_Progression,
  // Scope.GW2_Guilds,
];

export interface LoginButtonProps {
  scopes: Scope[],
  returnTo?: string,

  logout: boolean,
}

export const LoginButton: FC<LoginButtonProps> = ({ scopes, returnTo, logout }) => {
  const gw2me = useGw2MeClient();
  const triggerFedCM = useFedCM();
  const [fullPermissions, setFullPermissions] = useState(true);

  useEffect(() => {
    // check if FedCM is supported
    if(gw2me.fedCM.isSupported()) {
      // if the user got to the login page by logging out, prevent silent FedCM and return to not attempt passive login
      if(logout) {
        navigator.credentials.preventSilentAccess();
        return;
      }

      const abort = new AbortController();

      triggerFedCM({
        scopes: fullPermissions ? fullScopes : scopes,
        mediation: 'optional',
        signal: abort.signal,
        mode: 'passive',
        returnTo,
      });

      return () => abort.abort();
    }
  }, [fullPermissions, gw2me.fedCM, logout, returnTo, scopes, triggerFedCM]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback((e) => {
    // only handle submit if FedCM is supported
    if(!gw2me.fedCM.isSupported()) {
      return;
    }

    // cancel form submission
    e.preventDefault();

    triggerFedCM({
      scopes: fullPermissions ? fullScopes : scopes,
      mediation: 'optional',
      mode: 'active',
      returnTo,
    });
  }, [fullPermissions, gw2me.fedCM, returnTo, scopes, triggerFedCM]);

  return (
    <>
      <Checkbox checked={fullPermissions} onChange={setFullPermissions}>
        <span style={{ lineHeight: 1.5, position: 'relative', top: -1 }}>Grant gw2treasures.com permissions to access your Guild Wars 2 account data required for all pages.</span>
      </Checkbox>
      {!fullPermissions && (
        <div className={styles.limitedPermissions}>
          You might have to reauthorize again later to use some features.
        </div>
      )}

      <form action={redirectToGw2Me.bind(null, returnTo, fullPermissions ? fullScopes.join(' ') : scopes.join(' '))} onSubmit={handleSubmit}>
        <SubmitButton icon="gw2me" iconColor="#b7000d" type="submit" className={styles.loginButton}>Login with gw2.me</SubmitButton>
      </form>
    </>
  );
};
