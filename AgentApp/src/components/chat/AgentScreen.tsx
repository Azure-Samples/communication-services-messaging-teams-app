// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { useCallback, useContext, useEffect, useState } from 'react';
import './AgentScreen.css';
import { ChatScreen } from './ChatScreen';
import { ThreadList } from './ThreadList';
import { getToken } from '../../utils/getToken';
import { getEndpointUrl } from '../../utils/getEndpointUrl';
import { TeamsFxContext } from '../Context';
import { useData } from '@microsoft/teamsfx-react';
import { AgentUser, getAgentACSUser } from '../../utils/agentACSUser';

export const AgentScreen = (): JSX.Element => {
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [endpointUrl, setEndpointUrl] = useState('');
  const [selectedThreadId, setSelectedThreadId] = useState<string | undefined>(undefined);
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
      const token = await getToken(agentACSUser.ACSUserId);
      const displayName = agentACSUser.DisplayName;

      setUserId(agentACSUser.ACSUserId);
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
      />
    );
  }, [selectedThreadId, token, endpointUrl, userId, displayName]);

  return (
    <div className="welcome page">
      <div style={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
        {endpointUrl ? (
          <ThreadList
            userId={userId}
            token={token}
            endpointUrl={endpointUrl}
            setSelectedThreadId={setSelectedThreadId}
          />
        ) : (
          <div>Loading...</div>
        )}
        <div className="narrow">{chatScreen()}</div>
      </div>
    </div>
  );
};
