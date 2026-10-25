import type { useInteractions } from '@floating-ui/react';
import { createContext } from 'react';

export interface NavigationMenuContextValue {
  activeIndex: number | null,
  getItemProps: ReturnType<typeof useInteractions>['getItemProps'],
  close: () => void,
}

export const NavigationMenuContext = createContext<NavigationMenuContextValue | null>(null);
