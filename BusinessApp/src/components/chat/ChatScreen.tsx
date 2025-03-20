// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { ChatClientProvider, ChatThreadClientProvider, createStatefulChatClient } from '@azure/communication-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ChatHeader } from './ChatHeader';
import { updateAgentWorkItem } from '../../utils/fetchRequestUtils/agentWorkItem';
import { useChatScreenStyles } from '../../styles/ChatScreen.styles';
import { ThreadItemStatus } from './useThreads';
import { LoadingSpinner } from './LoadingSpinner';
import { ChatThreadClient } from '@azure/communication-chat';
import ChatComponents from './ChatComponents';
// These props are passed in when this component is referenced in JSX and not found in context
interface ChatScreenProps {
  token: string;
  userId: string;
  displayName: string;
  endpointUrl: string;
  threadId: string;
  receiverName: string;
  threadStatus: ThreadItemStatus;
  endChatHandler(isParticipantRemoved: boolean): void;
  resolveChatHandler(threadId: string): void;
}

export const ChatScreen = (props: ChatScreenProps): JSX.Element => {
  const {
    displayName,
    endpointUrl,
    threadId,
    token,
    userId,
    receiverName,
    threadStatus,
    endChatHandler,
    resolveChatHandler
  } = props;
  const styles = useChatScreenStyles();
  const [isLoading, setIsLoading] = useState(true);

  // Disables pull down to refresh. Prevents accidental page refresh when scrolling through chat messages
  // Another alternative: set body style touch-action to 'none'. Achieves same result.
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'null';
    };
  }, []);

  const handleOnResolveChat = useCallback(() => {
    const handleUpdateAgentWorkItem = async (threadId: string, status: ThreadItemStatus): Promise<void> => {
      try {
        await updateAgentWorkItem(threadId, status);
      } catch (error) {
        console.error(error);
      }
    };
    handleUpdateAgentWorkItem(threadId, ThreadItemStatus.RESOLVED);
    resolveChatHandler(threadId);
  }, [resolveChatHandler, threadId]);

  // Instantiate the statefulChatClient
  const statefulChatClient = useMemo(() => {
    const tokenCredential = new AzureCommunicationTokenCredential(token);
    const chatClient = createStatefulChatClient({
      userId: { communicationUserId: userId },
      displayName: displayName,
      endpoint: endpointUrl,
      credential: tokenCredential
    });
    chatClient.startRealtimeNotifications();

    return chatClient;
  }, [displayName, endpointUrl, token, userId]);

  const chatThreadClient = useMemo(() => {
    setIsLoading(true);
    console.log('loading ......');

    const threadClient = statefulChatClient.getChatThreadClient(threadId);
    const initializeThreadState = async (chatThreadClient: ChatThreadClient): Promise<void> => {
      await chatThreadClient.getProperties();
    };
    initializeThreadState(threadClient);
    setIsLoading(false);
    return threadClient;
  }, [statefulChatClient, threadId]);

  return (
    <div className={styles.chatScreenContainer}>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <ChatHeader
            personaName={receiverName}
            threadStatus={threadStatus}
            onResolveChat={() => handleOnResolveChat()}
          />
          <ChatClientProvider chatClient={statefulChatClient}>
            <ChatThreadClientProvider chatThreadClient={chatThreadClient}>
              <ChatComponents />
            </ChatThreadClientProvider>
          </ChatClientProvider>
        </>
      )}
    </div>
  );
};
