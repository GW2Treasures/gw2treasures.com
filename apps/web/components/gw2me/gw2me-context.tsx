'use client';

import { Gw2MeClient } from '@gw2me/client';
import { createContext, use, useMemo, type FC, type ReactNode } from 'react';

const context = createContext<{ client: Gw2MeClient, baseUrl?: string } | undefined>(undefined);

export interface Gw2MeProviderProps {
  clientId: string,
  baseUrl?: string,

  children: ReactNode,
}

export const Gw2MeProvider: FC<Gw2MeProviderProps> = ({ clientId, baseUrl, children }) => {
  const gw2me = useMemo(
    () => ({ client: new Gw2MeClient({ client_id: clientId }, { url: baseUrl }), baseUrl }),
    [baseUrl, clientId]
  );

  return (
    <context.Provider value={gw2me}>
      {children}
    </context.Provider>
  );
};

export function useGw2MeClient() {
  return use(context)!.client;
}

export function useGw2MeBaseUrl() {
  return use(context)?.baseUrl;
}
