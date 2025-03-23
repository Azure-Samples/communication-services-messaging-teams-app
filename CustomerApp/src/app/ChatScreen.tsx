// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import {
  ChatClientProvider,
  ChatThreadClientProvider,
  createStatefulChatClient,
  DEFAULT_COMPONENT_ICONS
} from '@azure/communication-react';
import { useEffect, useMemo, useState } from 'react';
import { ChatHeader } from './ChatHeader';
import { useChatScreenStyles } from './styles/ChatScreen.styles';
import { strings } from './utils/constants';
import { LoadingSpinner } from './LoadingSpinner';
import ChatComponents from './ChatComponents';
import { ChatThreadClient, ChatThreadPropertiesUpdatedEvent } from '@azure/communication-chat';
import { initializeIcons, registerIcons } from '@fluentui/react';

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
  agentName: string;
  onEndChat(chatThreadClient: ChatThreadClient): void;
}

export const ChatScreen = (props: ChatScreenProps): JSX.Element => {
  const { displayName, endpointUrl, threadId, token, userId, agentName, onEndChat } = props;
  const styles = useChatScreenStyles();
  const [chatThreadClient, setChatThreadClient] = useState<ChatThreadClient | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isResolvedByAgent, setIsResolvedByAgent] = useState(false);

  // Disables pull down to refresh. Prevents accidental page refresh when scrolling through chat messages
  // Another alternative: set body style touch-action to 'none'. Achieves same result.
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'null';
    };
  }, []);

  // Instantiate the statefulChatClient
  const statefulChatClient = useMemo(() => {
    const tokenCredential = new AzureCommunicationTokenCredential(token);
    const chatClient = createStatefulChatClient({
      userId: { communicationUserId: userId },
      displayName: displayName,
      endpoint: endpointUrl,
      credential: tokenCredential
    });
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

  useEffect(() => {
    const addChatClientListeners = async (): Promise<void> => {
      if (!statefulChatClient) {
        console.error('Failed to add listeners because client is not initialized');
        return;
      }
      await statefulChatClient.startRealtimeNotifications();

      statefulChatClient.on('chatMessageReceived', (event) => {
        console.log('Leah: Chat message received', event);
      });

      statefulChatClient.on('chatThreadPropertiesUpdated', (event: ChatThreadPropertiesUpdatedEvent) => {
        console.log('Leah: Chat thread properties updated', event);
        const { threadId: resolvedThreadId, properties } = event;
        if (!isResolvedByAgent && resolvedThreadId === threadId && properties.metadata?.isResolvedByAgent === 'true') {
          console.log('Chat has been resolved by the agent');
          setIsResolvedByAgent(true);
        }
      });
    };
    addChatClientListeners();
  }, [statefulChatClient, isResolvedByAgent, threadId, userId]);

  return isLoading || !chatThreadClient ? (
    <LoadingSpinner label={strings.initializeChatSpinnerLabel} />
  ) : (
    <div className={styles.chatScreenContainer}>
      <ChatHeader
        personaName={agentName}
        onEndChat={() => {
          onEndChat(chatThreadClient);
        }}
      />
      <ChatClientProvider chatClient={statefulChatClient}>
        <ChatThreadClientProvider chatThreadClient={chatThreadClient}>
          <ChatComponents />
        </ChatThreadClientProvider>
      </ChatClientProvider>
    </div>
  );
};
