'use client';

import { useFedCM } from '@/components/gw2me/fedcm-context';
import { useGw2MeClient } from '@/components/gw2me/gw2me-context';
import { Scope } from '@gw2me/client';
import { SubmitButton } from '@gw2treasures/ui/components/Form/Buttons/SubmitButton';
import { useCallback, useEffect, useState, type FC, type FormEventHandler } from 'react';
import { redirectToGw2Me } from './login.action';
import styles from './page.module.css';
import { Checkbox } from '@gw2treasures/ui/components/Form/Checkbox';
import type { TranslationSubset } from '@/lib/translate';

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

  translations: TranslationSubset<'login.button' | 'login.grant-all' | 'login.grant-all.hint'>
}

export const LoginButton: FC<LoginButtonProps> = ({ scopes, returnTo, logout, translations }) => {
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
        <span style={{ lineHeight: 1.5, position: 'relative', top: -1 }} data-nosnippet>{translations['login.grant-all']}</span>
      </Checkbox>
      {!fullPermissions && (
        <div className={styles.limitedPermissions} data-nosnippet>
          {translations['login.grant-all.hint']}
        </div>
      )}

      <form action={redirectToGw2Me.bind(null, returnTo, (fullPermissions ? fullScopes : scopes).join(' '))} onSubmit={handleSubmit}>
        <SubmitButton icon="gw2me" iconColor="#b7000d" type="submit" className={styles.loginButton}>
          {translations['login.button']}
        </SubmitButton>
      </form>
    </>
  );
};
