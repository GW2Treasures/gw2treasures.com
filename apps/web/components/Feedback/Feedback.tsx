'use client';

import { Icon } from '@gw2treasures/ui';
import { Button } from '@gw2treasures/ui/components/Form/Button';
import { FlexRow } from '@gw2treasures/ui/components/Layout/FlexRow';
import { useCallback, type FC, useState } from 'react';
import styles from './Feedback.module.css';

interface FeedbackProps {
  // TODO: define props
};

export const Feedback: FC<FeedbackProps> = ({ }) => {
  const [sending, setSending] = useState<boolean>();

  const sendFeedback = useCallback((helpful: boolean) => {
    setSending(helpful);

    setTimeout(() => setSending(undefined), 500);
  }, []);

  return (
    <div className={styles.feedback}>
      <FlexRow>
        <Icon icon="discord"/>
        Was this page helpful?
      </FlexRow>
      <div>
        <FlexRow>
          <Button iconOnly onClick={sendFeedback.bind(null, true)} disabled={sending !== undefined}>
            <Icon icon={sending === true ? 'loading' : 'checkmark'}/>
          </Button>
          <Button iconOnly onClick={sendFeedback.bind(null, false)} disabled={sending !== undefined}>
            <Icon icon={sending === false ? 'loading' : 'cancel'}/>
          </Button>
        </FlexRow>
      </div>
    </div>
  );
};
