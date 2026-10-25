'use client';

import { FloatingDelayGroup } from '@floating-ui/react';
import type { FC, ReactNode } from 'react';

export const NavigationDelayGroup: FC<{ children: ReactNode }> = ({ children }) => {
  // once a menu is open, the other menus open without delay
  return <FloatingDelayGroup delay={{ open: 250, close: 0 }}>{children}</FloatingDelayGroup>;
};
