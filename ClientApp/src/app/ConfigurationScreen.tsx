// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Button, Image, Text } from '@fluentui/react-components';
import { useCallback, useState } from 'react';
import { configurationScreenStyles } from './styles/ConfigurationScreen.styles';
import { InputSection } from './InputSection';
import { getToken } from './utils/getToken';
import { joinThread } from './utils/joinThread';
import { getEndpointUrl } from './utils/getEndpointUrl';
import { createThread } from './utils/createThread';
import configurationScreenHeroSVG from '../assets/configurationScreenHero.svg';
import { strings } from './utils/constants';
import { Dismiss20Regular } from '@fluentui/react-icons';
import { LoadingSpinner } from './LoadingSpinner';
import { assignAgentUser } from './utils/assignAgentUser';

export interface ConfigurationScreenProps {
  joinChatHandler(): void;
  setToken(token: string): void;
  setUserId(userId: string): void;
  setDisplayName(displayName: string): void;
  setThreadId(threadId: string): void;
  setEndpointUrl(endpointUrl: string): void;
  setAgentName(agentName: string): void;
  onCloseButtonClicked(): void;
  onErrorHandler?(error: string): void;
}

export const ConfigurationScreen = (props: ConfigurationScreenProps): JSX.Element => {
  const {
    joinChatHandler,
    setToken,
    setUserId,
    setDisplayName,
    setThreadId,
    setEndpointUrl,
    setAgentName,
    onCloseButtonClicked,
    onErrorHandler
  } = props;

  const styles = configurationScreenStyles();

  const [name, setName] = useState('');
  const [emptyNameWarning, setEmptyNameWarning] = useState(false);
  const [questionSummery, setQuestionSummery] = useState('');
  const [emptyQuestionSummeryWarning, setEmptyQuestionSummeryWarning] = useState(false);
  const [disableJoinChatButton, setDisableJoinChatButton] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // This function creates a new chat thread and a new ACS user,
  // then joins the thread with the newly created user.
  const createAndJoinChatThreadWithNewUser = useCallback(() => {
    const createAndJoinChatThread = async (): Promise<void> => {
      // Create a new chat thread
      const threadId = await createThread();
      if (!threadId) {
        console.error('Failed to create a thread, returned threadId is undefined or empty string');
        onErrorHandler?.(strings.failToCreateChatClient);
        return;
      }
      setThreadId(threadId);

      // Create a new ACS user
      const token = await getToken();
      const endpointUrl = await getEndpointUrl();

      setToken(token.token);
      setUserId(token.identity);
      setDisplayName(name);
      setEndpointUrl(endpointUrl);

      // Join the thread with the newly created user
      const result = await joinThread(threadId, token.identity, name);
      if (!result) {
        console.error('Failed to join the thread');
        onErrorHandler?.(strings.failToJoinChatThread);
        setDisableJoinChatButton(false);
        return;
      }

      // Assign a random agent
      const agentDisplayName = await assignAgentUser(threadId);
      if (agentDisplayName === undefined) {
        console.error('Failed to assign an agent to the chat thread');
        onErrorHandler?.(strings.failToAssignAgent);
        return;
      }
      setAgentName(agentDisplayName);

      setDisableJoinChatButton(false);
      joinChatHandler();
    };
    createAndJoinChatThread();
  }, [
    setThreadId,
    setAgentName,
    setToken,
    setUserId,
    setDisplayName,
    name,
    setEndpointUrl,
    joinChatHandler,
    onErrorHandler
  ]);

  const validateRequiredFields = (): boolean => {
    if (!name) {
      setEmptyNameWarning(true);
    }
    if (!questionSummery) {
      setEmptyQuestionSummeryWarning(true);
    }
    return !!name && !!questionSummery;
  };
  const startChat = (): void => {
    const validRequiredFields = validateRequiredFields();
    if (!validRequiredFields) {
      return;
    }
    setEmptyNameWarning(false);
    setEmptyQuestionSummeryWarning(false);
    setDisableJoinChatButton(true);
    setIsLoading(true);
    createAndJoinChatThreadWithNewUser();
  };

  const renderConfigurationView = (): JSX.Element => {
    return (
      <div className={styles.responsiveLayout}>
        <div className={styles.closeButtonContainer}>
          <Button
            icon={<Dismiss20Regular />}
            className={styles.closeButton}
            onClick={onCloseButtonClicked}
            aria-label={strings.close}
            aria-live="polite"
          />
        </div>
        <Image
          className={styles.imageContainer}
          alt={strings.chatWithAnExpert}
          src={configurationScreenHeroSVG.toString()}
        />
        <Text className={styles.heroText}>{strings.chatWithAnExpert}</Text>
        <div className={styles.inputContainer}>
          <InputSection
            labelText={strings.configurationDisplayNameLabelText}
            placeholder={strings.configurationDisplayNamePlaceholder}
            isEmpty={emptyNameWarning}
            emptyErrorMessage={strings.configurationDisplayNameEmptyErrorMessage}
            onTextChangedHandler={(newValue) => {
              setName(newValue);
              setEmptyNameWarning(!newValue);
            }}
            onKeyDownHandler={startChat}
          />
          <InputSection
            labelText={strings.configurationQuestionSummaryLabelText}
            placeholder={strings.configurationQuestionSummaryPlaceholder}
            isEmpty={emptyQuestionSummeryWarning}
            emptyErrorMessage={strings.configurationQuestionSummaryEmptyErrorMessage}
            onTextChangedHandler={(newValue) => {
              setQuestionSummery(newValue);
              setEmptyQuestionSummeryWarning(!newValue);
            }}
            onKeyDownHandler={startChat}
            isMultiline={true}
          />
          <Button
            appearance="primary"
            disabled={disableJoinChatButton}
            className={styles.startChatButton}
            onClick={startChat}
          >
            {strings.startChat}
          </Button>
        </div>
      </div>
    );
  };

  return isLoading ? <LoadingSpinner label={strings.initializeChatSpinnerLabel} /> : renderConfigurationView();
};
