// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Button, Text } from '@fluentui/react-components';
import { useEndConfirmationScreenStyles } from './styles/EndConfirmationScreen.styles';
import { strings } from './utils/constants';
import { useCallback } from 'react';
import { updateAgentWorkItem } from './utils/agentWorkItem';
import { ChatAdapter } from '@azure/communication-react';

export interface EndCallProps {
  userId: string;
  threadId: string;
  onConfirmLeaving(): void;
  onCancel(): void;
  adapter?: ChatAdapter;
}

export const EndConfirmationScreen = (props: EndCallProps): JSX.Element => {
  const { userId, threadId, adapter, onConfirmLeaving, onCancel } = props;
  const styles = useEndConfirmationScreenStyles();

  const handleOnConfirmLeaving = useCallback(() => {
    const resolveThread = async (): Promise<void> => {
      await updateAgentWorkItem(threadId, 'resolved');
    };
    adapter?.removeParticipant(userId);
    resolveThread();
    onConfirmLeaving();
  }, [adapter, onConfirmLeaving, threadId, userId]);

  return (
    <div className={styles.endChatContainer}>
      <div className={styles.textContainer}>
        <Text
          aria-level={1}
          aria-label={strings.endChatConfirmationTitle}
          aria-live="polite"
          className={styles.endChatTitle}
        >
          {strings.endChatConfirmationTitle}
        </Text>
        <Text
          aria-level={1}
          aria-label={strings.endChatConfirmationDescription}
          aria-live="polite"
          className={styles.endChatDescription}
        >
          {strings.endChatConfirmationDescription}
        </Text>
      </div>

      <div className={styles.buttonContainer}>
        <Button appearance="primary" className={styles.button} onClick={handleOnConfirmLeaving}>
          {strings.endChatConfirmationConfirmButton}
        </Button>
        <Button className={styles.button} onClick={onCancel}>
          {strings.endChatConfirmationCancelButton}
        </Button>
      </div>
    </div>
  );
};
