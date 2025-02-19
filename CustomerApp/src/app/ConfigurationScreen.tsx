// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Button, Image, Text } from '@fluentui/react-components';
import { useState } from 'react';
import { configurationScreenStyles } from './styles/ConfigurationScreen.styles';
import { InputSection } from './InputSection';
import configurationScreenHeroSVG from '../assets/configurationScreenHero.svg';
import { strings } from './utils/constants';
import { Dismiss20Regular } from '@fluentui/react-icons';
import { LoadingSpinner } from './LoadingSpinner';
import { createAndJoinChatThreadWithNewUser } from './utils/createAndJoinChatThreadWithNewUser';

export interface ConfigurationScreenProps {
  onJoinChat(): void;
  setToken(token: string): void;
  setUserId(userId: string): void;
  setDisplayName(displayName: string): void;
  setThreadId(threadId: string): void;
  setEndpointUrl(endpointUrl: string): void;
  setAgentName(agentName: string): void;
  onCloseButtonClicked(): void;
  onError(error: string, questionSummery: string): void;
}

export const ConfigurationScreen = (props: ConfigurationScreenProps): JSX.Element => {
  const {
    onJoinChat,
    setToken,
    setUserId,
    setDisplayName,
    setThreadId,
    setEndpointUrl,
    setAgentName,
    onCloseButtonClicked,
    onError
  } = props;

  const styles = configurationScreenStyles();

  const [name, setName] = useState('');
  const [emptyNameWarning, setEmptyNameWarning] = useState(false);
  const [questionSummery, setQuestionSummery] = useState('');
  const [emptyQuestionSummeryWarning, setEmptyQuestionSummeryWarning] = useState(false);
  const [disableJoinChatButton, setDisableJoinChatButton] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
    setDisplayName(name);

    createAndJoinChatThreadWithNewUser({
      displayName: name,
      questionSummery,
      onJoinChat,
      setToken,
      setUserId,
      setThreadId,
      setEndpointUrl,
      setAgentName,
      onError
    });
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
            emptyErrorMessage={strings.requiredTextFiledErrorMessage}
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
            emptyErrorMessage={strings.requiredTextFiledErrorMessage}
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
