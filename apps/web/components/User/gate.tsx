'use client';

import type { FC, ReactNode } from 'react';
import { useUser } from './use-user';

export interface UserGateProps {
  children: ReactNode,
}

export const UserGate: FC<UserGateProps> = ({ children }) => {
  const user = useUser();

  if(!user) {
    return null;
  }

  return (
    children
  );
};
