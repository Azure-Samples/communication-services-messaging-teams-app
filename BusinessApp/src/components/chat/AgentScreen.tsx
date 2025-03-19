// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { useCallback, useContext, useEffect, useState } from 'react';
import { ChatScreen } from './ChatScreen';
import { ThreadList } from './ThreadList';
import { getToken } from '../../utils/fetchRequestUtils/getToken';
import { getEndpointUrl } from '../../utils/fetchRequestUtils/getEndpointUrl';
import { TeamsFxContext } from '../Context';
import { useData } from '@microsoft/teamsfx-react';
import { AgentUser, getAgentACSUser } from '../../utils/fetchRequestUtils/agentACSUser';
import useThreads, { ThreadItemStatus } from './useThreads';
import { useAgentScreenStyles } from '../../styles/AgentScreen.styles';
import { threadStrings } from '../../utils/constants';
import { ErrorScreen } from './ErrorScreen';

export const AgentScreen = (): JSX.Element => {
  const styles = useAgentScreenStyles();
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [endpointUrl, setEndpointUrl] = useState('');
  const [selectedThreadId, setSelectedThreadId] = useState<string | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const { threads, setThreads, isLoading } = useThreads({ userId, token, endpointUrl });
  const { teamsUserCredential } = useContext(TeamsFxContext);

  const { loading, data, error } = useData(async () => {
    if (teamsUserCredential) {
      try {
        const userInfo = await teamsUserCredential.getUserInfo();
        return userInfo;
      } catch (error) {
        setErrorMessage(threadStrings.failToGetTeamsUserInfo);
      }
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
      try {
        const agentACSUser = await getACSUser();
        if (!agentACSUser) {
          return;
        }
        const endpointUrl = await getEndpointUrl();
        const token = await getToken(agentACSUser.acsUserId);
        const displayName = agentACSUser.displayName;

        setUserId(agentACSUser.acsUserId);
        setEndpointUrl(endpointUrl);
        setToken(token.token);
        setDisplayName(displayName);
      } catch (error) {
        setErrorMessage(threadStrings.failToLinkToACSUser);
      }
    };
    setScreenState();
  }, [getACSUser]);

  const chatScreen = useCallback(() => {
    if (!selectedThreadId || !token || !endpointUrl || !userId || !displayName) {
      return <></>;
    }
    const thread = threads?.find((thread) => thread.id === selectedThreadId);
    return (
      <ChatScreen
        token={token}
        userId={userId}
        displayName={displayName}
        endpointUrl={endpointUrl}
        threadId={selectedThreadId}
        receiverName={thread?.topic || ''}
        threadStatus={thread?.status || ThreadItemStatus.ACTIVE}
        endChatHandler={function (isParticipantRemoved: boolean): void {
          console.log('End chat handler called', isParticipantRemoved);
        }}
        resolveChatHandler={(threadId) => {
          setThreads((prevThreads) =>
            prevThreads.map((thread) => {
              if (thread.id === threadId) {
                return { ...thread, status: ThreadItemStatus.RESOLVED };
              }
              return thread;
            })
          );
        }}
      />
    );
  }, [selectedThreadId, token, endpointUrl, userId, displayName, threads, setThreads]);

  return (
    <div>
      {errorMessage ? (
        <ErrorScreen errorMessage={errorMessage} />
      ) : (
        <div className={styles.container}>
          <ThreadList onThreadSelected={setSelectedThreadId} threads={threads} isLoading={!endpointUrl || isLoading} />
          <div className={styles.chatContainer}>{chatScreen()}</div>
        </div>
      )}
    </div>
  );
};
