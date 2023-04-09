'use client';

import { FC, useCallback, useEffect, useState } from 'react';
import { Button, ButtonProps } from '../Button';

export interface CopyButtonProps extends Omit<ButtonProps, 'onClick'> {
  copy: string;
}

export const CopyButton: FC<CopyButtonProps> = ({ copy, ...props }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let timeout = 0;

    if(copied) {
      timeout = window.setTimeout(() => setCopied(false), 500);
    }

    () => {
      if(timeout) {
        clearTimeout(timeout);
      }
    };
  }, [copied]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(copy).then(() => setCopied(true));
  }, [copy]);

  const overrideProps: Partial<ButtonProps> = copied && props.icon ? { icon: 'checkmark' } : {};

  return (
    <Button onClick={handleCopy} {...props} {...overrideProps}/>
  );
};
