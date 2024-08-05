import type { Scope } from '@gw2me/client';
import type { FC, ReactNode } from 'react';
import { Notice } from '@gw2treasures/ui/components/Notice/Notice';
import { FlexRow } from '@gw2treasures/ui/components/Layout/FlexRow';
import { LinkButton } from '@gw2treasures/ui/components/Form/Button';

export interface Gw2AccountLoginNoticeProps {
  children?: ReactNode;
  requiredScopes: Scope[];
  optionalScopes?: Scope[];
}

export const Gw2AccountLoginNotice: FC<Gw2AccountLoginNoticeProps> = ({ children, requiredScopes, optionalScopes = [] }) => {
  const loginUrl = `/login?returnTo=${encodeURIComponent(location.pathname + location.search)}&scopes=${encodeURIComponent([...requiredScopes, ...optionalScopes].join(','))}`;

  return (
    <Notice>
      <FlexRow wrap>
        {children ?? 'gw2treasures.com requires additional authorizations to display this page.'}
        <LinkButton href={loginUrl} icon="user" appearance="tertiary">Login</LinkButton>
      </FlexRow>
    </Notice>
  );
};
