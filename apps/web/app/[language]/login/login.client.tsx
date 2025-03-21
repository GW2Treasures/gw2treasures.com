'use client';

import { useFedCM } from '@/components/gw2me/fedcm-context';
import { useGw2MeClient } from '@/components/gw2me/gw2me-context';
import { type Scope } from '@gw2me/client';
import { SubmitButton } from '@gw2treasures/ui/components/Form/Buttons/SubmitButton';
import { useCallback, useEffect, type FC, type FormEventHandler } from 'react';
import { redirectToGw2Me } from './login.action';

export interface LoginButtonProps {
  scopes: Scope[],
  returnTo?: string,

  logout: boolean,
}

export const LoginButton: FC<LoginButtonProps> = ({ scopes, returnTo, logout }) => {
  const gw2me = useGw2MeClient();
  const triggerFedCM = useFedCM();

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
        scopes,
        mediation: 'optional',
        signal: abort.signal,
        mode: 'passive',
        returnTo,
      });

      return () => abort.abort();
    }
  }, [gw2me.fedCM, logout, returnTo, scopes, triggerFedCM]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback((e) => {
    // only handle submit if FedCM is supported
    if(!gw2me.fedCM.isSupported()) {
      return;
    }

    // cancel form submission
    e.preventDefault();

    triggerFedCM({
      scopes,
      mediation: 'optional',
      mode: 'active',
      returnTo,
    });
  }, [gw2me.fedCM, returnTo, scopes, triggerFedCM]);

  return (
    <form action={redirectToGw2Me.bind(null, returnTo, scopes.join(' '))} onSubmit={handleSubmit}>
      <SubmitButton icon="gw2me" iconColor="#b7000d" type="submit">Login with gw2.me</SubmitButton>
    </form>
  );
};
