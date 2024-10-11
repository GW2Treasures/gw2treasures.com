'use client';

import { useState, type FC } from 'react';
import { Reload, type ReloadProps } from './Reload';
import { Checkbox } from '@gw2treasures/ui/components/Form/Checkbox';
import type { RefProp } from '@gw2treasures/ui/lib/react';

export const ReloadCheckbox: FC<ReloadProps & RefProp<HTMLLabelElement>> = ({ ref, ...reloadProps }) => {
  const [autoRefresh, setAutoRefresh] = useState(false);

  return (
    <>
      {autoRefresh && <Reload {...reloadProps}/>}
      <Checkbox checked={autoRefresh} onChange={setAutoRefresh} ref={ref}>
        Auto Refresh
      </Checkbox>
    </>
  );
};
