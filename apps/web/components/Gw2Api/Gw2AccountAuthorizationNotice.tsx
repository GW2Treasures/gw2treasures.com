import type { Scope } from '@gw2me/client';
import type { FC, ReactNode } from 'react';
import { reauthorize } from './reauthorize';
import { Notice } from '@gw2treasures/ui/components/Notice/Notice';
import { FlexRow } from '@gw2treasures/ui/components/Layout/FlexRow';
import { SubmitButton } from '@gw2treasures/ui/components/Form/Buttons/SubmitButton';

export interface Gw2AccountAuthorizationNoticeProps {
  children?: ReactNode;
  scopes: Scope[];
  requiredScopes: Scope[];
  optionalScopes?: Scope[];
}

export const Gw2AccountAuthorizationNotice: FC<Gw2AccountAuthorizationNoticeProps> = ({ children, scopes, requiredScopes, optionalScopes = [] }) => {
  const missingRequiredScopes = requiredScopes.some((scope) => !scopes.includes(scope));

  if(!missingRequiredScopes) {
    return null;
  }

  return (
    <form action={reauthorize.bind(null, [...requiredScopes, ...optionalScopes], undefined)}>
      <Notice>
        <FlexRow wrap>
          {children ?? 'gw2treasures.com requires additional authorizations to display this page.'}
          <SubmitButton type="submit" icon="gw2me-outline" appearance="tertiary">Authorize</SubmitButton>
        </FlexRow>
      </Notice>
    </form>
  );
};
