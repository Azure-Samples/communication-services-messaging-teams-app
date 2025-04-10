// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ChatScreen } from './ChatScreen';
import { ThreadList } from './ThreadList';
import { getToken } from '../../utils/fetchRequestUtils/getToken';
import { getEndpointUrl } from '../../utils/fetchRequestUtils/getEndpointUrl';
import { TeamsFxContext } from '../Context';
import { useData } from '@microsoft/teamsfx-react';
import { AgentUser, getAgentACSUser } from '../../utils/fetchRequestUtils/agentACSUser';
import { ThreadItemStatus, useThreads } from './useThreads';
import { useAgentScreenStyles } from '../../styles/AgentScreen.styles';
import { threadStrings } from '../../utils/constants';
import { ErrorScreen } from './ErrorScreen';
import { getNextActiveThreadId } from '../../utils/threadsUtils';
import { ToastNotification } from './ToastNotification';
import { capitalizeString } from '../../utils/utils';

export const AgentScreen = (): JSX.Element => {
  const styles = useAgentScreenStyles();
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [endpointUrl, setEndpointUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const tabs = useMemo(
    () => [capitalizeString(ThreadItemStatus.ACTIVE), capitalizeString(ThreadItemStatus.RESOLVED)],
    []
  );
  const [selectedTab, setSelectedTab] = useState<string>(tabs[0]);
  const {
    threads,
    setThreads,
    selectedThreadId,
    setSelectedThreadId,
    resolvedThreadId,
    setResolvedThreadId,
    isLoading
  } = useThreads({
    userId,
    token,
    endpointUrl
  });
  const { teamsUserCredential } = useContext(TeamsFxContext);

  const { loading, data, error } = useData(async () => {
    if (teamsUserCredential) {
      try {
        const userInfo = await teamsUserCredential.getUserInfo();
        return userInfo;
      } catch (error) {
        console.error('Failed to get user info: ', error);
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
        console.error('Failed to set screen state due to error: ', error);
        setErrorMessage(threadStrings.failToLinkToACSUser);
      }
    };
    setScreenState();
  }, [getACSUser]);

  const handleOnResolveChat = useCallback(
    (threadId: string) => {
      setThreads((prevThreads) =>
        prevThreads.map((thread) => {
          if (thread.id === threadId) {
            return { ...thread, status: ThreadItemStatus.RESOLVED };
          }
          return thread;
        })
      );
      const nextActiveThreadId = getNextActiveThreadId(threads, threadId);
      setSelectedThreadId(nextActiveThreadId);
    },
    [setSelectedThreadId, setThreads, threads]
  );

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
        onResolveChat={handleOnResolveChat}
      />
    );
  }, [selectedThreadId, token, endpointUrl, userId, displayName, threads, handleOnResolveChat]);

  const resolvedThreadCustomerDisplayName = useMemo(() => {
    if (!resolvedThreadId) {
      return;
    }
    const resolvedThread = threads.find((thread) => thread.id === resolvedThreadId);
    return resolvedThread?.topic;
  }, [resolvedThreadId, threads]);

  const handleOnViewThread = useCallback(
    (threadId: string) => {
      setSelectedThreadId(threadId);
      //Change tab to active
      setSelectedTab(tabs[1]);
      if (resolvedThreadId === threadId) {
        setResolvedThreadId(undefined);
      }
    },
    [resolvedThreadId, setResolvedThreadId, setSelectedThreadId, tabs]
  );

  const handleOnStatusTabSelected = useCallback(
    (tabValue: string) => {
      setSelectedTab(tabValue);
      const firstThreadOfSelectedTab = threads.find((thread) => thread.status === tabValue.toLowerCase());
      setSelectedThreadId(firstThreadOfSelectedTab?.id);
    },
    [setSelectedThreadId, threads]
  );

  return (
    <div>
      {errorMessage ? (
        <ErrorScreen errorMessage={errorMessage} />
      ) : (
        <div className={styles.container}>
          {resolvedThreadId && (
            <ToastNotification
              toasterId={resolvedThreadId}
              showToast={!!resolvedThreadId}
              toastBodyMessage={resolvedThreadCustomerDisplayName}
              onViewThread={handleOnViewThread}
            />
          )}
          <ThreadList
            selectedThreadId={selectedThreadId}
            onThreadSelected={setSelectedThreadId}
            threads={threads}
            isLoading={!endpointUrl || isLoading}
            tabs={tabs}
            selectedTab={selectedTab}
            onStatusTabSelected={handleOnStatusTabSelected}
          />
          <div className={styles.chatContainer}>{chatScreen()}</div>
        </div>
      )}
    </div>
  );
};
