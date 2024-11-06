// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { setLogLevel } from '@azure/logger';
import { initializeIcons, Spinner } from '@fluentui/react';
import { useState } from 'react';
import { ChatScreen } from './ChatScreen';
import { ConfigurationScreen } from './ConfigurationScreen';
import { EndScreen } from './EndScreen';
import { ErrorScreen } from './ErrorScreen';
import { HomeScreen } from './HomeScreen';
import { getExistingThreadIdFromURL } from './utils/getParametersFromURL';
import { initializeFileTypeIcons } from '@fluentui/react-file-type-icons';

setLogLevel('error');

initializeIcons();
initializeFileTypeIcons();

const ERROR_PAGE_TITLE_REMOVED = 'You have been removed from the chat.';

const webAppTitle = document.title;

enum Page {
  Home = 'home',
  Configuration = 'configuration',
  Chat = 'chat',
  End = 'end',
  Removed = 'removed'
}

export const App = (): JSX.Element => {
  const [page, setPage] = useState(Page.Home);
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [threadId, setThreadId] = useState('');
  const [endpointUrl, setEndpointUrl] = useState('');

  const renderPage = (): JSX.Element => {
    switch (page) {
      case Page.Home:{
          document.title = `home - ${webAppTitle}`;
          return <HomeScreen />;
        }
      case Page.Configuration:{
          document.title = `configuration - ${webAppTitle}`;
          return (
            <ConfigurationScreen
              joinChatHandler={() => {
                setPage(Page.Chat);
              }}
              setToken={setToken}
              setUserId={setUserId}
              setDisplayName={setDisplayName}
              setThreadId={setThreadId}
              setEndpointUrl={setEndpointUrl} />);
        }
      case Page.Chat:{
          document.title = `chat - ${webAppTitle}`;
          if (token && userId && displayName && threadId && endpointUrl) {
            return (
              <ChatScreen
                token={token}
                userId={userId}
                displayName={displayName}
                endpointUrl={endpointUrl}
                threadId={threadId}
                endChatHandler={(isParticipantRemoved) => {
                  if (isParticipantRemoved) {
                    setPage(Page.Removed);
                  } else {
                    setPage(Page.End);
                  }
                }} />);
          }

          return <Spinner label={'Loading...'} ariaLive="assertive" labelPosition="top" />;
        }
      case Page.End:{
          document.title = `end chat - ${webAppTitle}`;
          return (
            <EndScreen
              rejoinHandler={() => {
                setPage(Page.Chat); // use stored information to attempt to rejoin the chat thread
              }}
              homeHandler={() => {
                window.location.href = window.location.origin;
              }}
              userId={userId}
              displayName={displayName} />);
        }
      case Page.Removed:{
          document.title = `removed - ${webAppTitle}`;
          return (
            <ErrorScreen
              title={ERROR_PAGE_TITLE_REMOVED}
              homeHandler={() => {
                window.location.href = window.location.origin;
              }} />);
        }
      default:
        document.title = `error - ${webAppTitle}`;
        throw new Error('Page type not recognized');
    }
  };

  if (getExistingThreadIdFromURL() && page === 'home') {
    setPage(Page.Configuration);
  }

  return renderPage();
};
