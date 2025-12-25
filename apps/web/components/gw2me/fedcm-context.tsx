'use client';

import type { FedCMRequestOptions } from '@gw2me/client';
import { prepareAuthRequest } from 'app/[language]/login/login.action';
import { createContext, use, useCallback, type FC, type ReactNode } from 'react';
import { useGw2MeClient } from './gw2me-context';

export interface FedCMTriggerOptions extends Omit<FedCMRequestOptions, 'state' | 'code_challenge' | 'code_challenge_method'> {
  returnTo?: string,
}

const FedCMContext = createContext<(options: FedCMTriggerOptions) => Promise<void>>(() => new Promise(() => {}));

export interface FedCMProviderProps {
  baseUrl?: string,
  children: ReactNode,
}

export const FedCMProvider: FC<FedCMProviderProps> = ({ baseUrl, children }) => {
  const gw2me = useGw2MeClient();

  const trigger = useCallback(async ({ returnTo, ...requestOptions }: FedCMTriggerOptions) => {
    // check if FedCM is supported
    if(!gw2me.fedCM.isSupported()) {
      return;
    }

    try {
      // generate state and PKCE on server
      const auth = await prepareAuthRequest(returnTo);

      // trigger actual FedCM request
      const credential = await gw2me.fedCM.request({
        ...requestOptions,
        ...auth.pkce,
      });

      // check if we get a token back
      if(credential) {
        // generate callback url
        const params = new URLSearchParams();
        params.set('iss', baseUrl ?? 'https://gw2.me');
        params.set('state', auth.state);
        params.set('code', credential.token);

        // redirect to callback url
        location.href = `/auth/callback?${params}`;
      }
    } catch {
      // ignore errors (this just falls back to the regular login flow)
    }
  }, [baseUrl, gw2me.fedCM]);

  return (
    <FedCMContext value={trigger}>
      {children}
    </FedCMContext>
  );
};

export function useFedCM() {
  return use(FedCMContext);
}
