'use client';

import { FC, useState } from 'react';
import { Reload, ReloadProps } from './Reload';
import { Checkbox } from '../Form/Checkbox';

export interface ReloadCheckboxProps extends ReloadProps {

}

export const ReloadCheckbox: FC<ReloadCheckboxProps> = ({ ...reloadProps }) => {
  const [autoRefresh, setAutoRefresh] = useState(false);

  return (
    <>
      {autoRefresh && <Reload {...reloadProps}/>}
      <Checkbox checked={autoRefresh} onChange={setAutoRefresh}>
        Auto Refresh
      </Checkbox>
    </>
  );
};
