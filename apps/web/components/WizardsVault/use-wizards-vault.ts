import type { ResponseWithLoading } from '@/lib/response';
import type { AccountWizardsVaultMetaObjectives, AccountWizardsVaultSpecialObjectives } from '@gw2api/types/data/account-wizardsvault';
import { useSubscription, useSubscriptionWithReset } from '../Gw2Api/use-gw2-subscription';

export function useWizardsVault(accountId: string): ResponseWithLoading<{ daily: AccountWizardsVaultMetaObjectives | null, weekly: AccountWizardsVaultMetaObjectives | null, special: AccountWizardsVaultSpecialObjectives | null }> {
  const daily = useSubscriptionWithReset('wizards-vault.daily', accountId, 'last-daily', null);
  const weekly = useSubscriptionWithReset('wizards-vault.weekly', accountId, 'last-weekly', null);
  const special = useSubscription('wizards-vault.special', accountId);

  if(daily.loading || weekly.loading || special.loading) {
    return { loading: true };
  }
  if(daily.error || weekly.error || special.error) {
    return { loading: false, error: true };
  }

  return {
    loading: false,
    error: false,
    daily: daily.data,
    weekly: weekly.data,
    special: special.data
  };
}
