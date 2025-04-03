// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import {
  ChatClientProvider,
  ChatThreadClientProvider,
  createStatefulChatClient,
  DEFAULT_COMPONENT_ICONS,
  FluentThemeProvider,
  lightTheme
} from '@azure/communication-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ChatHeader } from './ChatHeader';
import { updateAgentWorkItem } from '../../utils/fetchRequestUtils/agentWorkItem';
import { useChatScreenStyles } from '../../styles/ChatScreen.styles';
import { ThreadItemStatus } from './useThreads';
import { LoadingSpinner } from './LoadingSpinner';
import { ChatThreadClient } from '@azure/communication-chat';
import { ChatComponents } from './ChatComponents';
import { initializeIcons, registerIcons } from '@fluentui/react';
import config from '../../lib/config';
import { useTeamsUserCredential } from '@microsoft/teamsfx-react';
import { v8DarkTheme } from '../../utils/themeUtils';

// Register Fluent UI V8 icons so component icons, such as send button, can be displayed
initializeIcons();
registerIcons({ icons: DEFAULT_COMPONENT_ICONS });

// These props are passed in when this component is referenced in JSX and not found in context
interface ChatScreenProps {
  token: string;
  userId: string;
  displayName: string;
  endpointUrl: string;
  threadId: string;
  receiverName: string;
  threadStatus: ThreadItemStatus;
  onResolveChat(threadId: string): void;
}

export const ChatScreen = (props: ChatScreenProps): JSX.Element => {
  const { displayName, endpointUrl, threadId, token, userId, receiverName, threadStatus, onResolveChat } = props;
  const styles = useChatScreenStyles();
  const [chatThreadClient, setChatThreadClient] = useState<ChatThreadClient | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  // Access the current theme
  const { themeString } = useTeamsUserCredential({
    initiateLoginEndpoint: config.initiateLoginEndpoint,
    clientId: config.clientId
  });

  // Disables pull down to refresh. Prevents accidental page refresh when scrolling through chat messages
  // Another alternative: set body style touch-action to 'none'. Achieves same result.
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'null';
    };
  }, []);

  const handleOnResolveChat = useCallback(() => {
    const resolveChat = async (threadId: string, status: ThreadItemStatus): Promise<void> => {
      try {
        // Update the chat thread metadata to notify the CustomerApp that the chat has been resolved
        await chatThreadClient?.updateProperties({ metadata: { isResolvedByAgent: 'true' } });
        await updateAgentWorkItem(threadId, status);
      } catch (error) {
        console.error(error);
      }
    };
    resolveChat(threadId, ThreadItemStatus.RESOLVED);
    onResolveChat(threadId);
  }, [chatThreadClient, onResolveChat, threadId]);

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

  useEffect(() => {
    const initializeChatThreadClient = async (): Promise<void> => {
      setIsLoading(true);
      const threadClient = statefulChatClient.getChatThreadClient(threadId);
      try {
        await threadClient.getProperties();
        setChatThreadClient(threadClient);
      } catch (error) {
        console.error('Failed to initialize chat thread client:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeChatThreadClient();
  }, [statefulChatClient, threadId]);

  const isDarkMode = useMemo(() => {
    return themeString === 'dark';
  }, [themeString]);

  return (
    <div className={styles.chatScreenContainer}>
      {isLoading || !chatThreadClient ? (
        <LoadingSpinner />
      ) : (
        <>
          <ChatHeader
            personaName={receiverName}
            threadStatus={threadStatus}
            onResolveChat={() => handleOnResolveChat()}
          />
          <FluentThemeProvider fluentTheme={isDarkMode ? v8DarkTheme : lightTheme} rootStyle={{ height: 'auto' }}>
            <ChatClientProvider chatClient={statefulChatClient}>
              <ChatThreadClientProvider chatThreadClient={chatThreadClient}>
                <ChatComponents isDarkMode={isDarkMode} />
              </ChatThreadClientProvider>
            </ChatClientProvider>
          </FluentThemeProvider>
        </>
      )}
    </div>
  );
};
