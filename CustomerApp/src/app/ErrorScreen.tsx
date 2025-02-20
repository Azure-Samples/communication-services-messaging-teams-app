// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Button, Text } from '@fluentui/react-components';
import { useErrorScreenStyles } from './styles/ErrorScreen.styles';
import { strings } from './utils/constants';
import { Dismiss20Regular, ErrorCircle48Regular } from '@fluentui/react-icons';
import { useCallback, useState } from 'react';
import { createAndJoinChatThreadWithNewUser } from './utils/createAndJoinChatThreadWithNewUser';
import { LoadingSpinner } from './LoadingSpinner';

export interface ErrorScreenProps {
  message: string;
  onClose(): void;
  onRetrySucceed(): void;
  displayName: string;
  questionSummary: string;
  setToken(token: string): void;
  setUserId(userId: string): void;
  setThreadId(threadId: string): void;
  setEndpointUrl(endpointUrl: string): void;
  setAgentName(agentName: string): void;
}

export const ErrorScreen = (props: ErrorScreenProps): JSX.Element => {
  const {
    message,
    onClose,
    onRetrySucceed,
    displayName,
    questionSummary,
    setToken,
    setUserId,
    setThreadId,
    setEndpointUrl,
    setAgentName
  } = props;
  const styles = useErrorScreenStyles();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [disableRetryButton, setDisableRetryButton] = useState<boolean>(false);

  const handleOnRetryError = useCallback(() => {
    setDisableRetryButton(false);
    setIsLoading(false);
  }, []);

  const handleOnRetry = useCallback(() => {
    setIsLoading(true);
    setDisableRetryButton(true);
    // Use the stored information to attempt to rejoin the chat thread
    createAndJoinChatThreadWithNewUser({
      displayName,
      questionSummary,
      onJoinChat: onRetrySucceed,
      setToken: setToken,
      setUserId: setUserId,
      setThreadId: setThreadId,
      setEndpointUrl: setEndpointUrl,
      setAgentName: setAgentName,
      onError: handleOnRetryError
    });
  }, [
    displayName,
    questionSummary,
    onRetrySucceed,
    setToken,
    setUserId,
    setThreadId,
    setEndpointUrl,
    setAgentName,
    handleOnRetryError
  ]);

  return isLoading ? (
    <LoadingSpinner label={strings.initializeChatSpinnerLabel} />
  ) : (
    <div className={styles.errorScreenContainer}>
      <div className={styles.closeButtonContainer}>
        <Button
          icon={<Dismiss20Regular />}
          className={styles.closeButton}
          onClick={onClose}
          aria-label={strings.close}
          aria-live="polite"
        />
      </div>
      <div className={styles.textContainer}>
        <ErrorCircle48Regular className={styles.errorIcon} />
        <Text
          aria-level={1}
          aria-label={strings.endChatConfirmationTitle}
          aria-live="polite"
          className={styles.errorTitle}
        >
          {strings.errorScreenTitle}
        </Text>
        <Text
          aria-level={1}
          aria-label={strings.endChatConfirmationDescription}
          aria-live="polite"
          className={styles.errorMessage}
        >
          {message}
        </Text>
      </div>

      <div className={styles.buttonContainer}>
        <Button appearance="primary" className={styles.button} onClick={handleOnRetry} disabled={disableRetryButton}>
          {strings.errorScreenRetryButton}
        </Button>
        <Button className={styles.button} onClick={onClose}>
          {strings.close}
        </Button>
      </div>
    </div>
  );
};
