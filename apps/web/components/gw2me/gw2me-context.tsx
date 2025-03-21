'use client';

import { Gw2MeClient } from '@gw2me/client';
import { createContext, use, useMemo, type FC, type ReactNode } from 'react';
import { FedCMProvider } from './fedcm-context';

const Gw2MeContext = createContext<Gw2MeClient | undefined>(undefined);

export interface Gw2MeProviderProps {
  clientId: string,
  baseUrl?: string,

  children: ReactNode,
}

export const Gw2MeProvider: FC<Gw2MeProviderProps> = ({ clientId, baseUrl, children }) => {
  const gw2me = useMemo(
    () => new Gw2MeClient({ client_id: clientId }, { url: baseUrl }),
    [baseUrl, clientId]
  );

  return (
    <Gw2MeContext value={gw2me}>
      <FedCMProvider baseUrl={baseUrl}>
        {children}
      </FedCMProvider>
    </Gw2MeContext>
  );
};

export function useGw2MeClient() {
  return use(Gw2MeContext)!;
}
