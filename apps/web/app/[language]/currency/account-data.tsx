'use client';

import type { FC } from 'react';
import { useGw2Account } from '@/components/Gw2Api/use-gw2-account';
import { useSubscription } from '@/components/Gw2Api/use-gw2-subscription';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { CurrencyValue } from '@/components/Currency/CurrencyValue';
import { SortableDynamicDataTableCell } from '@gw2treasures/ui/components/Table/DataTable.client';
import { Gw2ApiErrorBadge } from '@/components/Gw2Api/api-error-badge';

export const AccountWalletCell: FC<{ currencyId: number }> = ({ currencyId }) => {
  const { id: accountId } = useGw2Account();
  const wallet = useSubscription('wallet', accountId);

  if (wallet.loading) {
    return (<td><Skeleton/></td>);
  } else if (wallet.error) {
    return (<td><Gw2ApiErrorBadge/></td>);
  }

  const currency = wallet.data.find(({ id }) => id === currencyId);

  return (
    <SortableDynamicDataTableCell value={currency?.value}>
      <td align="right">
        <CurrencyValue currencyId={currencyId} value={currency?.value ?? 0}/>
      </td>
    </SortableDynamicDataTableCell>
  );
};
