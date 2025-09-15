'use client';

import { Icon } from '@gw2treasures/ui';
import { TableRowButton } from '@gw2treasures/ui/components/Table/TableRowButton';
import { useState, type FC, type ReactNode } from 'react';

export interface RevisionTableHiddenRowsProps {
  label: string,
  hiddenIndexes: number[],
  children: ReactNode[],
}

export const RevisionTableHiddenRows: FC<RevisionTableHiddenRowsProps> = ({ label, children, hiddenIndexes }) => {
  const [showHidden, setShowHidden] = useState(false);

  if(showHidden || hiddenIndexes.length === 0) {
    return children;
  }

  // only return children that are not hidden
  return [
    children.filter((row, i) => !hiddenIndexes.includes(i)),
    <TableRowButton key="expand" thin onClick={() => setShowHidden(true)}><Icon icon="chevron-down"/> {label.replace('{0}', hiddenIndexes.length.toString())}</TableRowButton>
  ];
};
