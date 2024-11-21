import "./AgentScreen.css";

import { ChatClient } from '@azure/communication-chat';
import type {  ChatThreadCreatedEvent } from '@azure/communication-chat';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { useEffect, useMemo, useState } from "react";

export interface ThreadItem {
  id: string;
  topic: string;
  isUnread: boolean;
  lastReceivedMessageId?: string;
}

export interface ThreadListProps {
  userId: string;
  token: string;
  endpointUrl: string;
  setSelectedThreadId(threadId: string): void;
}
  
export const ThreadList = (props: ThreadListProps): JSX.Element => {
  const { userId, token, endpointUrl, setSelectedThreadId } = props;
  const [ threads, setThreads ] = useState<ThreadItem[]>([]);

  const chatClient = useMemo(() => {
    if (!endpointUrl) {
      return;
    }    
    const createChatClient = async () => {      
      if (!token) {
        return;
      }
      const tokenCredential = new AzureCommunicationTokenCredential(token);
      const chatClient = new ChatClient(endpointUrl, tokenCredential);
      return chatClient;
    }
    return createChatClient();
  }, [endpointUrl, token]);

  useEffect(() => {
    const addChatClientListeners = async () => {
      const client = await chatClient;
      if (!client) {
        console.log('Failed to add listeners because client is not initialized');
        return;
      }
      await client.startRealtimeNotifications();

      client.on('chatThreadCreated', (event: ChatThreadCreatedEvent) => {
        const threadItem = {
          id: event.threadId,
          isUnread: true,
          topic: event.properties.topic,
          deletedOn: undefined,
          lastMessageReceivedOn: Date.now()
        };
        setThreads([threadItem, ...threads]);
      } );
    }
    addChatClientListeners();
 }, [chatClient, threads, userId]);

 const onThreadSelected = (threadId: string) => {
  setSelectedThreadId(threadId);
}

// TODO: UI will be handled in the future
const threadItem = (thread: ThreadItem) => {  
  return (
    <div key={thread.id} style={{ display: 'flex', flexDirection: 'row', padding: '10px', borderBottom: '1px solid #ccc' }}>
      <button onClick={() => onThreadSelected(thread.id)}>{thread.topic}</button>
    </div>
  )
}

  return (
    <div style={{ width: '400px' }}>
        <h1 style={{ marginLeft: '15px' }}>Thread List</h1>
      {threads.map((thread) => (
        threadItem(thread)
      ))}
    </div>
  );
}
