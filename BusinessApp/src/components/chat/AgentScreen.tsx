// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { useCallback, useContext, useEffect, useState } from 'react';
import './AgentScreen.css';
import { ChatScreen } from './ChatScreen';
import { ThreadList } from './ThreadList';
import { getToken } from '../../utils/fetchRequestUtils/getToken';
import { getEndpointUrl } from '../../utils/fetchRequestUtils/getEndpointUrl';
import { TeamsFxContext } from '../Context';
import { useData } from '@microsoft/teamsfx-react';
import { AgentUser, getAgentACSUser } from '../../utils/fetchRequestUtils/agentACSUser';
import useThreads from './useThreads';

export const AgentScreen = (): JSX.Element => {
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [endpointUrl, setEndpointUrl] = useState('');
  const [selectedThreadId, setSelectedThreadId] = useState<string | undefined>(undefined);
  const { threads, setThreads } = useThreads({ userId, token, endpointUrl });
  const { teamsUserCredential } = useContext(TeamsFxContext);

  const { loading, data, error } = useData(async () => {
    if (teamsUserCredential) {
      const userInfo = await teamsUserCredential.getUserInfo();
      return userInfo;
    }
  });

  const getACSUser = useCallback(async (): Promise<AgentUser | undefined> => {
    const teamsUserId = loading || error || !data ? '' : data.objectId;
    // Fetch ACS user from the server
    if (teamsUserId) {
      const agentACSUser = await getAgentACSUser(teamsUserId);
      return agentACSUser;
    }
  }, [data, error, loading]);

  useEffect(() => {
    const setScreenState = async (): Promise<void> => {
      const agentACSUser = await getACSUser();
      if (!agentACSUser) {
        // TODO: Display error screen if user ID is not found
        return;
      }
      const endpointUrl = await getEndpointUrl();
      const token = await getToken(agentACSUser.acsUserId);
      const displayName = agentACSUser.displayName;

      setUserId(agentACSUser.acsUserId);
      setEndpointUrl(endpointUrl);
      setToken(token.token);
      setDisplayName(displayName);
    };
    setScreenState();
  }, [getACSUser]);

  // TODO: UI will be handled in the future
  const emptyChatScreen = (): JSX.Element => {
    return (
      <div className="empty-screen">
        <h1>Welcome to the chat app</h1>
        <p>Select a thread to start chatting</p>
      </div>
    );
  };

  // TODO: UI will be handled in the future
  const chatScreen = useCallback(() => {
    if (!selectedThreadId || !token || !endpointUrl || !userId || !displayName) {
      return emptyChatScreen();
    }
    return (
      <ChatScreen
        token={token}
        userId={userId}
        displayName={displayName}
        endpointUrl={endpointUrl}
        threadId={selectedThreadId}
        endChatHandler={function (isParticipantRemoved: boolean): void {
          console.log('End chat handler called', isParticipantRemoved);
        }}
        resolveChatHandler={(threadId) => {
          setThreads((prevThreads) =>
            prevThreads.map((thread) => {
              if (thread.id === threadId) {
                return { ...thread, status: 'resolved' };
              }
              return thread;
            })
          );
        }}
      />
    );
  }, [selectedThreadId, token, endpointUrl, userId, displayName, setThreads]);

  return (
    <div className="welcome page">
      <div style={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
        {endpointUrl && threads ? (
          <ThreadList onThreadSelected={setSelectedThreadId} threads={threads} />
        ) : (
          <div>Loading...</div>
        )}
        <div className="narrow">{chatScreen()}</div>
      </div>
    </div>
  );
};
