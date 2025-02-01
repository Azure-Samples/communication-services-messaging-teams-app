// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { useState, useEffect, useMemo } from 'react';
import { ChatClient, ChatMessageReceivedEvent, ChatThreadItem } from '@azure/communication-chat';
import { AzureCommunicationTokenCredential, CommunicationUserKind } from '@azure/communication-common';
import { createAgentWorkItem, getAgentWorkItems, AgentWorkItem } from '../../utils/fetchRequestUtils/agentWorkItem';

export interface ThreadItem {
  id: string;
  topic: string;
  lastMessageReceivedOn: Date;
  status?: string;
}

interface UseThreadsProps {
  userId: string;
  token: string;
  endpointUrl: string;
}

const useThreads = (
  props: UseThreadsProps
): { threads: ThreadItem[]; setThreads: React.Dispatch<React.SetStateAction<ThreadItem[]>> } => {
  const { userId, token, endpointUrl } = props;
  const [threads, setThreads] = useState<ThreadItem[]>([]);

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
        console.error('Failed to add listeners because client is not initialized');
        return;
      }
      await client.startRealtimeNotifications();

      client.on('participantsAdded', async (event) => {
        const participantsAdded = event.participantsAdded;
        const isCurrentUserAdded = participantsAdded.some((participant) => {
          const participantId = participant.id as CommunicationUserKind;
          return participantId.communicationUserId === userId;
        });

        if (isCurrentUserAdded) {
          const topic = (await client.getChatThreadClient(event.threadId).getProperties()).topic;
          const threadItem: ThreadItem = {
            id: event.threadId,
            topic: topic,
            lastMessageReceivedOn: new Date(),
            // Default status for new threads
            status: 'active'
          };

          setThreads((prevThreads: ThreadItem[]) => {
            const existingThreadIndex = prevThreads.findIndex((thread) => thread.id === threadItem.id);
            if (existingThreadIndex === -1) {
              // Thread does not exist, add it to the beginning of the list
              return [threadItem, ...prevThreads];
            }
            return prevThreads;
          });
        }
      });

      client.on('chatMessageReceived', (event: ChatMessageReceivedEvent) => {
        // Bubble up the thread with new message to the top of the list
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

      const agentWorkItems = await getAgentWorkItems();

      for (const thread of threadItems) {
        const agentWorkItem = agentWorkItems.find((properties: AgentWorkItem) => properties.id === thread.id);
        if (!agentWorkItem) {
          console.info(`Thread properties not found for thread: ${thread.id}`);
          try {
            await createAgentWorkItem(thread.id, 'active');
          } catch (error) {
            console.error(error);
          }
        } else {
          thread.status = agentWorkItem?.status;
        }
      }

      setThreads((prevThreads) => {
        const existingThreadIds = new Set(prevThreads.map((thread) => thread.id));
        const newThreads = threadItems.filter((thread: ThreadItem) => !existingThreadIds.has(thread.id));
        return [...prevThreads, ...newThreads];
      });
    };
    fetchThreads();
  }, [chatClient, userId]);

  return { threads, setThreads };
};

export default useThreads;
