import { createContext } from 'react';
import type { Gw2Account } from './types';

export const Gw2AccountContext = createContext<Gw2Account | undefined>(undefined);
Gw2AccountContext.displayName = 'Gw2AccountContext';
