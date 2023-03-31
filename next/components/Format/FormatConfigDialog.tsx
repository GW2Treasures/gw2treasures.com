import { FC } from 'react';
import { Dialog } from '../Dialog/Dialog';
import { MenuList } from '../MenuList/MenuList';
import { useFormatContext } from './FormatContext';
import { FormatDate } from './FormatDate';
import { FormatNumber } from './FormatNumber';

export interface FormatConfigDialogProps {
  open: boolean;
  onClose: () => void
}

export const FormatConfigDialog: FC<FormatConfigDialogProps> = ({ open, onClose }) => {
  const { locale } = useFormatContext();

  return (
    <Dialog title="Formatting Settings" onClose={onClose} open={open}>
      <MenuList>
        <div style={{ padding: 8, display: 'flex', justifyContent: 'space-between' }}>Locale <span>{locale}</span></div>
        <div style={{ padding: 8, display: 'flex', justifyContent: 'space-between' }}>Date <FormatDate date={new Date()}/></div>
        <div style={{ padding: 8, display: 'flex', justifyContent: 'space-between' }}>Relative Date <FormatDate relative date={new Date()}/></div>
        <div style={{ padding: 8, display: 'flex', justifyContent: 'space-between' }}>Number <span><FormatNumber value={1234567.89}/></span></div>
      </MenuList>
    </Dialog>
  );
};
