'use client';

import { fetchGw2Api } from '@/components/Gw2Api/fetch-gw2-api';
import { useGw2Accounts } from '@/components/Gw2Api/use-gw2-accounts';
import { Button } from '@gw2treasures/ui/components/Form/Button';
import { Notice } from '@gw2treasures/ui/components/Notice/Notice';
import { useCallback, type FC, useState } from 'react';

export interface CleanupToolProps {
  // TODO: add props
}

export const CleanupTool: FC<CleanupToolProps> = ({ }) => {
  const accounts = useGw2Accounts();
  const [status, setStatus] = useState(false);

  const run = useCallback(async () => {
    const characters = await Promise.all(accounts.map(({ subtoken }) => fetchGw2Api('/v2/characters?ids=all', { token: subtoken })));

    const i = await fetchGw2Api('/v2/items/5');

  }, [accounts]);

  if(accounts.length === 0) {
    return (
      <Notice>You will need to authorize gw2treasures.com</Notice>
    );
  }

  return (
    <>
      <Button icon="item" onClick={run}>Start</Button>
    </>
  );
};
