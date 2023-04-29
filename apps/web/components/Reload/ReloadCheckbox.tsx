'use client';

import { forwardRef, useState } from 'react';
import { Reload, ReloadProps } from './Reload';
import { Checkbox } from '@gw2treasures/ui/components/Form/Checkbox';

export interface ReloadCheckboxProps extends ReloadProps {}

export const ReloadCheckbox = forwardRef<HTMLLabelElement, ReloadCheckboxProps>(({ ...reloadProps }, ref) => {
  const [autoRefresh, setAutoRefresh] = useState(false);

  return (
    <>
      {autoRefresh && <Reload {...reloadProps}/>}
      <Checkbox checked={autoRefresh} onChange={setAutoRefresh} ref={ref}>
        Auto Refresh
      </Checkbox>
    </>
  );
});

ReloadCheckbox.displayName = 'ReloadCheckbox';
