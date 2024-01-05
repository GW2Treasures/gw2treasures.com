'use client';

import { type FC, type ReactNode, useCallback } from 'react';
import { useFormState } from 'react-dom';
import { Notice } from '../Notice/Notice';

export interface FormState {
  error?: string;
  success?: string;
}

export interface FormProps<State> {
  action: (state: State, payload: FormData) => Promise<State>,
  initialState?: State,
  children: ReactNode;
  id?: string;
}

export const Form: FC<FormProps<FormState>> = ({ action, initialState, children, id }) => {
  const [state, formAction] = useFormState(action, initialState ?? {});

  const showNotice = useCallback((notice: HTMLElement | null) => {
    notice?.scrollIntoView({ block: 'nearest' });
  }, []);

  return (
    <form action={formAction} id={id}>
      {state.error && (
        <Notice type="error" ref={showNotice} key={crypto.randomUUID()}>{state.error}</Notice>
      )}
      {state.success && (
        <Notice ref={showNotice} key={crypto.randomUUID()}>{state.success}</Notice>
      )}

      {children}
    </form>
  );
};
