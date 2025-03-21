'use client';

import { Gw2MeClient, type Scope } from '@gw2me/client';
import { SubmitButton } from '@gw2treasures/ui/components/Form/Buttons/SubmitButton';
import { useCallback, useEffect, type FC, type FormEventHandler } from 'react';
import { prepareAuthRequest, redirectToGw2Me } from './login.action';
import { useGw2MeBaseUrl, useGw2MeClient } from '@/components/gw2me/gw2me-context';

export interface LoginButtonProps {
  scope: Scope[],
  returnTo?: string,

  logout: boolean,
}

export const LoginButton: FC<LoginButtonProps> = ({ scope, returnTo, logout }) => {
  const gw2me = useGw2MeClient();
  const gw2meBaseUrl = useGw2MeBaseUrl();

  useEffect(() => {
    // check if FedCM is supported
    if(gw2me.fedCM.isSupported()) {
      // if the user got to the login page by logging out, prevent silent FedCM and return to not attempt passive login
      if(logout) {
        navigator.credentials.preventSilentAccess();
        return;
      }

      const abort = new AbortController();

      // get auth request
      prepareAuthRequest(returnTo).then((auth) => {
        // attemp passive FedCM login
        gw2me.fedCM.request({
          scopes: scope,
          mediation: 'optional',
          signal: abort.signal,
          mode: 'passive',
          ...auth.pkce,
        }).then(handleFedCMResponse(auth.state, gw2meBaseUrl));
      });

      return () => abort.abort();
    }
  }, [gw2me.fedCM, gw2meBaseUrl, logout, returnTo, scope]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback((e) => {
    // only handle submit if FedCM is supported
    if(!gw2me.fedCM.isSupported()) {
      return;
    }

    // cancel form submission
    e.preventDefault();

    prepareAuthRequest(returnTo).then((auth) => {
      try {
        // this is not awaited on purpose, so only sync errors are catched
        gw2me.fedCM.request({
          scopes: scope,
          mediation: 'optional',
          mode: 'active',
          ...auth.pkce,
        }).then(handleFedCMResponse(auth.state, gw2meBaseUrl));
      } catch {
        // if the FedCM request fails synchronously (bad invocation),
        // fallback to the normal OAuth2 flow
        redirectToGw2Me(returnTo, scope.join(' '));
      }
    });
  }, [gw2me.fedCM, gw2meBaseUrl, returnTo, scope]);

  return (
    <form action={redirectToGw2Me.bind(null, returnTo, scope.join(' '))} onSubmit={handleSubmit}>
      <SubmitButton icon="gw2me" iconColor="#b7000d" type="submit">Login with gw2.me</SubmitButton>
    </form>
  );
};

function handleFedCMResponse(state: string, gw2meBaseUrl: string | undefined) {
  return (credential: Awaited<ReturnType<Gw2MeClient['fedCM']['request']>>) => {
    if(credential) {
      // construct custom callback URL
      const callbackUrl = new URL('/auth/callback', location.href);
      callbackUrl.searchParams.set('iss', gw2meBaseUrl ?? 'https://gw2.me');
      callbackUrl.searchParams.set('state', state);
      callbackUrl.searchParams.set('code', credential.token);

      // redirect to callback url
      location.href = callbackUrl.toString();
    }
  };
}
