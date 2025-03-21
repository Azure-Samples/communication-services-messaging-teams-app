// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { useChatFloatingWindowStyles } from './styles/ChatFloatingWindow.styles';
import { useState } from 'react';
import { ChatScreen } from './ChatScreen';
import { ConfigurationScreen } from './ConfigurationScreen';
import { EndConfirmationScreen } from './EndConfirmationScreen';
import { ErrorScreen } from './ErrorScreen';
import { strings } from './utils/constants';
import { LoadingSpinner } from './LoadingSpinner';
import { ChatThreadClient } from '@azure/communication-chat';

enum Page {
  Configuration = 'configuration',
  Chat = 'chat',
  EndConfirmation = 'endConfirmation',
  Error = 'error'
}

interface ChatFloatingWindowProps {
  onCloseButtonClick: () => void;
}

export const ChatFloatingWindow = (props: ChatFloatingWindowProps): JSX.Element => {
  const styles = useChatFloatingWindowStyles();
  const { onCloseButtonClick } = props;
  const [page, setPage] = useState(Page.Configuration);
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [threadId, setThreadId] = useState('');
  const [endpointUrl, setEndpointUrl] = useState('');
  const [questionSummary, setQuestionSummary] = useState('');
  const [agentName, setAgentName] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const [chatThreadClient, setChatThreadClient] = useState<ChatThreadClient | undefined>(undefined);

  const renderPage = (): JSX.Element => {
    switch (page) {
      case Page.Configuration: {
        return (
          <ConfigurationScreen
            onJoinChat={() => {
              setPage(Page.Chat);
            }}
            setToken={setToken}
            setUserId={setUserId}
            setDisplayName={setDisplayName}
            setThreadId={setThreadId}
            setEndpointUrl={setEndpointUrl}
            setAgentName={setAgentName}
            onCloseButtonClicked={onCloseButtonClick}
            onError={(error: string, questionSummary: string) => {
              setQuestionSummary(questionSummary); // store the questionSummary to be used for the retry function in the error screen
              setErrorMessage(error);
              setPage(Page.Error);
            }}
          />
        );
      }
      case Page.Chat: {
        if (token && userId && displayName && threadId && endpointUrl) {
          return (
            <ChatScreen
              token={token}
              userId={userId}
              displayName={displayName}
              endpointUrl={endpointUrl}
              threadId={threadId}
              agentName={agentName}
              onEndChat={(chatThreadClient: ChatThreadClient) => {
                setChatThreadClient(chatThreadClient);
                setPage(Page.EndConfirmation);
              }}
            />
          );
        }
        return <LoadingSpinner label={strings.initializeChatSpinnerLabel} />;
      }
      case Page.EndConfirmation: {
        return (
          <EndConfirmationScreen
            userId={userId}
            threadId={threadId}
            chatThreadClient={chatThreadClient}
            onConfirmLeaving={() => {
              onCloseButtonClick();
            }}
            onCancel={() => {
              setPage(Page.Chat);
            }}
          />
        );
      }
      default:
        return (
          <ErrorScreen
            message={errorMessage || strings.pageNotFoundErrorMessage}
            onClose={() => {
              setErrorMessage(undefined);
              setQuestionSummary('');
              onCloseButtonClick();
            }}
            onRetrySucceed={() => {
              setQuestionSummary('');
              setPage(Page.Chat);
            }}
            displayName={displayName}
            questionSummary={questionSummary}
            setToken={setToken}
            setUserId={setUserId}
            setThreadId={setThreadId}
            setEndpointUrl={setEndpointUrl}
            setAgentName={setAgentName}
          />
        );
    }
  };

  return <div className={styles.floatingWindow}>{renderPage()}</div>;
};
