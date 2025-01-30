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
  const [agentName, setAgentName] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const renderPage = (): JSX.Element => {
    switch (page) {
      case Page.Configuration: {
        return (
          <ConfigurationScreen
            joinChatHandler={() => {
              setPage(Page.Chat);
            }}
            setToken={setToken}
            setUserId={setUserId}
            setDisplayName={setDisplayName}
            setThreadId={setThreadId}
            setEndpointUrl={setEndpointUrl}
            setAgentName={setAgentName}
            onCloseButtonClicked={onCloseButtonClick}
            onError={(error: string) => {
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
              endChatHandler={() => {
                setPage(Page.EndConfirmation);
              }}
              onError={(error: string) => {
                setErrorMessage(error);
                setPage(Page.Error);
              }}
            />
          );
        }
        return <LoadingSpinner label={strings.initializeChatSpinnerLabel} />;
      }
      case Page.EndConfirmation: {
        return (
          <EndConfirmationScreen
            onConfirmLeaving={() => {
              onCloseButtonClick();
            }}
            onCancel={() => {
              setPage(Page.Chat);
            }}
          />
        );
      }
      // TODO: This section will be completed in a subsequent PR
      default:
        return (
          <ErrorScreen
            title={errorMessage || 'Page not found'}
            homeHandler={() => {
              setErrorMessage(undefined);
              onCloseButtonClick();
            }}
          />
        );
    }
  };

  return <div className={styles.floatingWindow}>{renderPage()}</div>;
};
