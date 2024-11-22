// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import './AgentScreen.css';

import { ChatClient } from '@azure/communication-chat';
import type { ChatThreadCreatedEvent, ChatThreadItem, ChatMessageReceivedEvent } from '@azure/communication-chat';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { useEffect, useMemo, useState } from 'react';

export interface ThreadItem {
  id: string;
  topic: string;
  lastMessageReceivedOn?: Date;
}

export interface ThreadListProps {
  userId: string;
  token: string;
  endpointUrl: string;
  setSelectedThreadId(threadId: string): void;
}

export const ThreadList = (props: ThreadListProps): JSX.Element => {
  const { userId, token, endpointUrl, setSelectedThreadId } = props;
  const [threads, setThreads] = useState<Array<ThreadItem>>([]);

  const chatClient = useMemo(() => {
    if (!endpointUrl) {
      return;
    }
    const createChatClient = async (): Promise<ChatClient | undefined> => {
      if (!token) {
        return;
      }
      const tokenCredential = new AzureCommunicationTokenCredential(token);
      const chatClient = new ChatClient(endpointUrl, tokenCredential);
      return chatClient;
    };
    return createChatClient();
  }, [endpointUrl, token]);

  useEffect(() => {
    const addChatClientListeners = async (): Promise<void> => {
      const client = await chatClient;
      if (!client) {
        console.log('Failed to add listeners because client is not initialized');
        return;
      }
      await client.startRealtimeNotifications();

      client.on('chatThreadCreated', (event: ChatThreadCreatedEvent) => {
        const threadItem = {
          id: event.threadId,
          topic: event.properties.topic,
          lastMessageReceivedOn: new Date()
        };

        setThreads((prevThreads: ThreadItem[]) => {
          const existingThreadIndex = prevThreads.findIndex((thread) => thread.id === threadItem.id);
          if (existingThreadIndex === -1) {
            // Thread does not exist, add it to the beginning of the list
            return [threadItem, ...prevThreads];
          }
          return prevThreads;
        });
      });

      client.on('chatMessageReceived', (event: ChatMessageReceivedEvent) => {
        const threadId = event.threadId;
        setThreads((prevThreads: ThreadItem[]) => {
          const threadIndex = prevThreads.findIndex((thread) => thread.id === threadId);
          if (threadIndex === -1) {
            console.error(`Received message for unknown thread: ${threadId}`);
            return prevThreads;
          }
          const [updatedThread] = prevThreads.splice(threadIndex, 1);
          updatedThread.lastMessageReceivedOn = new Date();
          return [updatedThread, ...prevThreads];
        });
      });
    };
    addChatClientListeners();
  }, [chatClient, userId]);

  useEffect(() => {
    const fetchThreads = async (): Promise<void> => {
      const client = await chatClient;
      if (!client) {
        return;
      }

      const threadsRespond = await client.listChatThreads().byPage().next();
      const threads = threadsRespond.value;
      const threadItems = threads.map((thread: ChatThreadItem) => {
        return {
          id: thread.id,
          topic: thread.topic,
          lastMessageReceivedOn: thread.lastMessageReceivedOn
        };
      });
      setThreads(threadItems);
    };
    fetchThreads();
  }, [chatClient, userId]);

  const onThreadSelected = (threadId: string): void => {
    setSelectedThreadId(threadId);
  };

  // TODO: UI will be handled in the future
  const threadItem = (thread: ThreadItem): JSX.Element => {
    return (
      <div
        key={thread.id}
        style={{ display: 'flex', flexDirection: 'row', padding: '10px', borderBottom: '1px solid #ccc' }}
      >
        <button onClick={() => onThreadSelected(thread.id)}>{thread.topic}</button>
      </div>
    );
  };

  return (
    <div style={{ width: '400px' }}>
      <h1 style={{ marginLeft: '15px' }}>Thread List</h1>
      {threads.map((thread) => threadItem(thread))}
    </div>
  );
};
