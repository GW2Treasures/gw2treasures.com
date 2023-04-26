import { FC, useEffect, useState } from 'react';
import { Dialog } from '../Dialog/Dialog';
import { ExternalLink } from '../Link/ExternalLink';
import { Steps } from '../Steps/Steps';
import { TextInput } from '../Form/TextInput';
import { Button } from '../Form/Button';
import { Separator } from '../Layout/Separator';
import { Tip } from '../Tip/Tip';
import Icon from 'icons/Icon';

export interface AddAccountDialogProps {
  open: boolean;
  onClose: () => void
}

export const AddAccountDialog: FC<AddAccountDialogProps> = ({ open, onClose }) => {
  const [apiKey, setApiKey] = useState('');

  return (
    <Dialog title="Add Account" open={open} onClose={onClose}>
      <Steps>
        <div>Visit <ExternalLink href="https://account.arena.net/applications">Guild Wars 2 Account Page</ExternalLink></div>
        <div>Generate a new API key <Tip tip={<p style={{ maxWidth: 300 }}>You can also use an already existing API key, but it is a good practice to generate separate API keys for all applications, so you later can revoke access one by one.</p>} preferredPlacement="right-start"><Icon icon="info"/></Tip></div>
        <div>
          Paste your key into this form
          <form style={{ marginTop: 16, display: 'flex', gap: 16 }}>
            <TextInput value={apiKey} onChange={setApiKey} placeholder="API key"/>
            <Button type="submit" disabled>Submit</Button>
          </form>
        </div>
      </Steps>
      <Separator/>
      <div style={{ color: 'var(--color-text-muted)', lineHeight: 1.5, fontSize: 14 }}>
        <div>gw2treasures.com will only be able to read data of your account provided by the official API.</div>
        <div>gw2treasures.com will NOT be able to write any data to your account.</div>
        <div>gw2treasures.com will NOT share your API Key with any 3rd party without asking for your explicit permission first.</div>
        <div>You can remove access at any time by deleting the API key.</div>
      </div>
    </Dialog>
  );
};
