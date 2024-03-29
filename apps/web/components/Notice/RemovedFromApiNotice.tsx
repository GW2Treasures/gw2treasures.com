import type { FC } from 'react';
import { Notice } from '@gw2treasures/ui/components/Notice/Notice';

export interface RemovedFromApiNoticeProps {
  type: string;
}

export const RemovedFromApiNotice: FC<RemovedFromApiNoticeProps> = ({ type }) => {
  return (
    <Notice type="warning" icon="revision">
      This {type} is currently not available in the Guild Wars 2 API and you are seeing the last known version. The {type} has either been removed from the game or needs to be rediscovered.
    </Notice>
  );
};
