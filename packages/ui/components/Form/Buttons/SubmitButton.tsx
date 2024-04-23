'use client';

import { Button, type ButtonProps } from '../Button';
import type { FC } from 'react';
import { useFormStatus } from 'react-dom';

export interface SubmitButtonProps extends ButtonProps {}

export const SubmitButton: FC<SubmitButtonProps> = ({ disabled, icon, iconColor, ...props }) => {
  const { pending } = useFormStatus();

  return <Button type="submit" {...props} disabled={disabled || pending} icon={pending ? 'loading' : icon} iconColor={pending ? undefined : iconColor}/>;
};
