'use client';

import { Button, type ButtonProps } from '@gw2treasures/ui/components/Form/Button';
import { type FC, useCallback, useEffect, useState } from 'react';

export interface ShareButtonProps {
  data: ShareData;
  appearance?: ButtonProps['appearance'],
  flex?: ButtonProps['flex'],
}

export const ShareButton: FC<ShareButtonProps> = ({ data, appearance, flex }) => {
  const [canShare, setCanShare] = useState(false);
  useEffect(() => setCanShare(navigator.canShare?.(data) ?? false), [data]);

  const handleShare = useCallback(() => {
    navigator.share(data);
  }, [data]);

  if(!canShare) {
    return null;
  }

  return (
    <Button appearance={appearance} flex={flex} onClick={handleShare} icon="external">
      Share
    </Button>
  );
};
