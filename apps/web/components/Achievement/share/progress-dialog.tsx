import { Gw2Accounts } from '@/components/Gw2Api/Gw2Accounts';
import { Scope } from '@gw2me/client';
import { Dialog, type DialogProps } from '@gw2treasures/ui/components/Dialog/Dialog';
import { Button } from '@gw2treasures/ui/components/Form/Button';
import { CopyButton } from '@gw2treasures/ui/components/Form/Buttons/CopyButton';
import { TextInput } from '@gw2treasures/ui/components/Form/TextInput';
import { FlexRow } from '@gw2treasures/ui/components/Layout/FlexRow';
import { useCallback, useState, useTransition, type FC } from 'react';
import { createAchievementSnapshotUrl } from './action';

export interface AchievementProgressShareDialogProps {
  open: boolean,
  onClose: DialogProps['onClose'],
  achievementId: number,
}

const requiredScopes = [
  Scope.Accounts,
  Scope.GW2_Account,
  Scope.GW2_Progression,
];

export const AchievementProgressShareDialog: FC<AchievementProgressShareDialogProps> = ({ open, onClose, achievementId }) => {
  const [{ url, error }, setState] = useState<{ url?: string, error?: string }>({});

  const [loading, start] = useTransition();

  const handleClick = useCallback(() => {
    start(async () => {
      setState(await createAchievementSnapshotUrl(achievementId));
    });
  }, [achievementId]);

  return (
    <Dialog open={open} onClose={onClose} title="Share your progress">
      <p>Share a snapshot of your achievement progress with others.</p>

      <Gw2Accounts requiredScopes={requiredScopes}>
        <FlexRow>
          <TextInput type="text" value={url ?? ''} readOnly/>
          {url
            ? <CopyButton copy={url} icon="copy">Copy</CopyButton>
            : <Button icon={loading ? 'loading' : 'legendary'} onClick={handleClick}>Create URL</Button>
          }
        </FlexRow>
      </Gw2Accounts>
      {error && <p style={{ marginTop: 8, color: 'var(--color-error)' }}>{error}</p>}
    </Dialog>
  );
};
