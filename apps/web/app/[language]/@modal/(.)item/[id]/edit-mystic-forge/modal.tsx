'use client';

import { Dialog } from '@/components/Dialog/Dialog';
import { useRouter } from 'next/navigation';
import type { FC, ReactNode } from 'react';

export interface ModalProps {
  title: ReactNode,
  children: ReactNode,
}

export const Modal: FC<ModalProps> = ({ title, children }) => {
  const { back } = useRouter();

  return (
    <Dialog title={title} onClose={() => back()}>
      {children}
    </Dialog>
  );
};
