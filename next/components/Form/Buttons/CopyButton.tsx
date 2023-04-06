'use client';

import { FC, useCallback } from 'react';
import { Button, ButtonProps } from '../Button';

export interface CopyButtonProps extends Omit<ButtonProps, 'onClick'> {
  copy: string;
}

export const CopyButton: FC<CopyButtonProps> = ({ copy, ...props }) => {
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(copy);
  }, [copy]);

  return (
    <Button onClick={handleCopy} {...props}/>
  );
};
