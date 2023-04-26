'use client';

import { FC, useState } from 'react';
import { AddAccountDialog } from './AddAccountDialog';
import { Button } from '../Form/Button';

export interface AccountTableProps {
  // TODO: add props
}

export const AccountTable: FC<AccountTableProps> = ({ }) => {
  const [addAccountDialogOpen, setAddAccountDialogOpen] = useState(false);

  return (
    <>
      <AddAccountDialog open={addAccountDialogOpen} onClose={() => setAddAccountDialogOpen(false)}/>
      <Button onClick={() => setAddAccountDialogOpen(true)}>Add Account</Button>
    </>
  );
};
