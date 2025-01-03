// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CommunicationUserIdentifier } from '@azure/communication-common';
import {
  AvatarPersonaData,
  ChatAdapter,
  ChatComposite,
  fromFlatCommunicationIdentifier,
  toFlatCommunicationIdentifier,
  useAzureCommunicationChatAdapter
} from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import { useCallback, useEffect, useMemo } from 'react';
import { ChatHeader } from './ChatHeader';
import { chatCompositeContainerStyle, chatScreenContainerStyle } from '../../styles/ChatScreen.styles';
import { createAutoRefreshingCredential } from '../../utils/fetchRequestUtils/credential';
import { fetchEmojiForUser } from '../../utils/fetchRequestUtils/emojiCache';
import { getBackgroundColor } from '../../utils/utils';
import { AgentWorkItemStatus } from '../../utils/fetchRequestUtils/agentWorkItem';
// These props are passed in when this component is referenced in JSX and not found in context
interface ChatScreenProps {
  token: string;
  userId: string;
  displayName: string;
  endpointUrl: string;
  threadId: string;
  endChatHandler(isParticipantRemoved: boolean): void;
  resolveChatHandler(threadId: string): void;
}

export const ChatScreen = (props: ChatScreenProps): JSX.Element => {
  const { displayName, endpointUrl, threadId, token, userId, endChatHandler, resolveChatHandler } = props;

  // Disables pull down to refresh. Prevents accidental page refresh when scrolling through chat messages
  // Another alternative: set body style touch-action to 'none'. Achieves same result.
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'null';
    };
  }, []);

  const adapterAfterCreate = useCallback(
    async (adapter: ChatAdapter): Promise<ChatAdapter> => {
      adapter.on('participantsRemoved', (listener) => {
        const removedParticipantIds = listener.participantsRemoved.map((p) => toFlatCommunicationIdentifier(p.id));
        if (removedParticipantIds.includes(userId)) {
          const removedBy = toFlatCommunicationIdentifier(listener.removedBy.id);
          endChatHandler(removedBy !== userId);
        }
      });
      adapter.on('error', (e) => {
        console.error(e);
      });
      return adapter;
    },
    [endChatHandler, userId]
  );

  const adapterArgs = useMemo(
    () => ({
      endpoint: endpointUrl,
      userId: fromFlatCommunicationIdentifier(userId) as CommunicationUserIdentifier,
      displayName,
      credential: createAutoRefreshingCredential(userId, token),
      threadId
    }),
    [endpointUrl, userId, displayName, token, threadId]
  );
  const adapter = useAzureCommunicationChatAdapter(adapterArgs, adapterAfterCreate);

  // Dispose of the adapter in the window's before unload event
  useEffect(() => {
    const disposeAdapter = (): void => adapter?.dispose();
    window.addEventListener('beforeunload', disposeAdapter);
    return () => window.removeEventListener('beforeunload', disposeAdapter);
  }, [adapter]);

  const handleOnResolveChat = useCallback(() => {
    const updateAgentWorkItem = async (threadId: string, status: AgentWorkItemStatus): Promise<void> => {
      try {
        await updateAgentWorkItem(threadId, status);
      } catch (error) {
        console.error(error);
      }
    };
    updateAgentWorkItem(threadId, 'resolved');
    resolveChatHandler(threadId);
  }, [resolveChatHandler, threadId]);

  if (adapter) {
    const onFetchAvatarPersonaData = (userId: string): Promise<AvatarPersonaData> =>
      fetchEmojiForUser(userId).then(
        (emoji) =>
          new Promise((resolve) => {
            return resolve({
              imageInitials: emoji,
              initialsColor: emoji ? getBackgroundColor(emoji)?.backgroundColor : undefined
            });
          })
      );
    return (
      <Stack className={chatScreenContainerStyle}>
        <Stack.Item className={chatCompositeContainerStyle} role="main">
          <ChatComposite
            adapter={adapter}
            options={{
              autoFocus: 'sendBoxTextField'
            }}
            onFetchAvatarPersonaData={onFetchAvatarPersonaData}
          />
        </Stack.Item>
        <ChatHeader onResolveChat={() => handleOnResolveChat()} />
      </Stack>
    );
  }
  return <>Initializing...</>;
};
