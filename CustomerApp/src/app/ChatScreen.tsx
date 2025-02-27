// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CommunicationUserIdentifier } from '@azure/communication-common';
import {
  ChatAdapter,
  ChatComposite,
  fromFlatCommunicationIdentifier,
  useAzureCommunicationChatAdapter
} from '@azure/communication-react';
import { useCallback, useEffect, useMemo } from 'react';
import { ChatHeader } from './ChatHeader';
import { useChatScreenStyles } from './styles/ChatScreen.styles';
import { createAutoRefreshingCredential } from './utils/credential';
import { strings } from './utils/constants';
import { LoadingSpinner } from './LoadingSpinner';
// These props are passed in when this component is referenced in JSX and not found in context
interface ChatScreenProps {
  token: string;
  userId: string;
  displayName: string;
  endpointUrl: string;
  threadId: string;
  agentName: string;
  onEndChat(adapter: ChatAdapter): void;
  onError?(error: string): void;
}

export const ChatScreen = (props: ChatScreenProps): JSX.Element => {
  const { displayName, endpointUrl, threadId, token, userId, agentName, onEndChat, onError } = props;
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
      adapter.on('error', (e) => {
        console.error(e);
        onError?.(e.message);
      });
      return adapter;
    },
    [onError]
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

  if (adapter) {
    return (
      <div className={styles.chatScreenContainer}>
        <ChatHeader
          personaName={agentName}
          onEndChat={() => {
            onEndChat(adapter);
          }}
        />
        <div className={styles.chatCompositeContainer}>
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

  return <LoadingSpinner label={strings.initializeChatSpinnerLabel} />;
};
