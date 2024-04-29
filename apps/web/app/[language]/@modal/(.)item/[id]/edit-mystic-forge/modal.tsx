'use client';

import { Dialog } from '@gw2treasures/ui/components/Dialog/Dialog';
import { usePathname, useRouter } from 'next/navigation';
import { useRef, type FC, type ReactNode } from 'react';

export interface ModalProps {
  title: ReactNode,
  children: ReactNode,
}

export const Modal: FC<ModalProps> = ({ title, children }) => {
  const { back } = useRouter();

  const pathname = usePathname();
  const initialPath = useRef(pathname);

  // workaround for https://github.com/vercel/next.js/discussions/50284
  if(pathname !== initialPath.current) {
    console.log(`Not rendering @modal because current pathname ("${pathname}") does not match expected "${initialPath.current}"`);
    return null;
  }

  return (
    <Dialog title={title} onClose={() => back()}>
      {children}
    </Dialog>
  );
};
