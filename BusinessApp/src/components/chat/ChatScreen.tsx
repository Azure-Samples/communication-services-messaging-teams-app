// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CommunicationUserIdentifier } from '@azure/communication-common';
import {
  ChatAdapter,
  ChatComposite,
  fromFlatCommunicationIdentifier,
  toFlatCommunicationIdentifier,
  useAzureCommunicationChatAdapter
} from '@azure/communication-react';
import { useCallback, useEffect, useMemo } from 'react';
import { ChatHeader } from './ChatHeader';
import { createAutoRefreshingCredential } from '../../utils/fetchRequestUtils/credential';
import { updateAgentWorkItem } from '../../utils/fetchRequestUtils/agentWorkItem';
import { useChatScreenStyles } from '../../styles/ChatScreen.styles';
import { ThreadItemStatus } from './useThreads';
import { LoadingSpinner } from './LoadingSpinner';
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

  if (adapter) {
    return (
      <div className={styles.chatScreenContainer}>
        <ChatHeader
          personaName={receiverName}
          threadStatus={threadStatus}
          onResolveChat={() => handleOnResolveChat()}
        />
        <div className={styles.chatCompositeContainer} role="main">
          <ChatComposite
            adapter={adapter}
            options={{
              autoFocus: 'sendBoxTextField',
              topic: false
            }}
          />
        </div>
      </div>
    );
  }
  return <LoadingSpinner />;
};
