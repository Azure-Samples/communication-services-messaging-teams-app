// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { useState, useEffect, useMemo } from 'react';
import { ChatClient, ChatMessageReceivedEvent, ChatThreadItem } from '@azure/communication-chat';
import { AzureCommunicationTokenCredential, CommunicationUserKind } from '@azure/communication-common';
import { createAgentWorkItem, getAgentWorkItems, AgentWorkItem } from '../../utils/fetchRequestUtils/agentWorkItem';
import { getNextActiveThreadId } from '../../utils/threadsUtils';

export interface ThreadItem {
  id: string;
  topic: string;
  lastMessageReceivedOn: Date;
  status?: ThreadItemStatus;
}

export enum ThreadItemStatus {
  ACTIVE = 'active',
  RESOLVED = 'resolved'
}

interface UseThreadsProps {
  userId: string;
  token: string;
  endpointUrl: string;
}

interface UseThreadsReturn {
  threads: ThreadItem[];
  setThreads: React.Dispatch<React.SetStateAction<ThreadItem[]>>;
  selectedThreadId?: string;
  setSelectedThreadId: React.Dispatch<React.SetStateAction<string | undefined>>;
  resolvedThreadId?: string;
  setResolvedThreadId: React.Dispatch<React.SetStateAction<string | undefined>>;
  isLoading: boolean;
}

export const useThreads = (props: UseThreadsProps): UseThreadsReturn => {
  const { userId, token, endpointUrl } = props;
  const [threads, setThreads] = useState<ThreadItem[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState<string | undefined>(undefined);
  const [resolvedThreadId, setResolvedThreadId] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
      try {
        const client = await chatClient;
        if (!client) {
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
              status: ThreadItemStatus.ACTIVE
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

        client.on('participantsRemoved', async (event) => {
          // Update thread status to 'resolved' when participant is removed
          const threadId = event.threadId;
          setThreads((prevThreads: ThreadItem[]) => {
            const threadIndex = prevThreads.findIndex((thread) => thread.id === threadId);
            if (threadIndex === -1) {
              console.error(`Participant removed from unknown thread: ${threadId}`);
              return prevThreads;
            }
            const [updatedThread] = prevThreads.splice(threadIndex, 1);
            updatedThread.status = ThreadItemStatus.RESOLVED;
            const newThreads = [updatedThread, ...prevThreads];
            newThreads.sort(
              (a: ThreadItem, b: ThreadItem) => b.lastMessageReceivedOn.getTime() - a.lastMessageReceivedOn.getTime()
            );
            return newThreads;
          });

          if (selectedThreadId === threadId) {
            const nextActiveThreadId = getNextActiveThreadId(threads, threadId);
            setSelectedThreadId(nextActiveThreadId);
          }
          setResolvedThreadId(threadId);
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
            if (
              updatedThread.status === ThreadItemStatus.RESOLVED &&
              (event.sender as CommunicationUserKind).communicationUserId !== userId
            ) {
              updatedThread.status = ThreadItemStatus.ACTIVE;
            }
            return [updatedThread, ...prevThreads];
          });
        });
      } catch (error) {
        console.error('Failed to add listeners because client is not initialized');
      }
    };
    addChatClientListeners();
  }, [chatClient, selectedThreadId, threads, userId]);

  useEffect(() => {
    const fetchThreads = async (): Promise<void> => {
      setIsLoading(true);
      try {
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
            try {
              await createAgentWorkItem(thread.id, ThreadItemStatus.ACTIVE);
            } catch (error) {
              console.error(`Fail to create thread status work item for thread ${thread.id} due to ${error}`);
            }
          } else {
            thread.status = agentWorkItem?.status;
          }
        }

        threadItems.sort(
          (a: ThreadItem, b: ThreadItem) => b.lastMessageReceivedOn.getTime() - a.lastMessageReceivedOn.getTime()
        );

        setThreads(threadItems);
      } catch (error) {
        console.error('Failed to fetch threads');
      }
      setIsLoading(false);
    };
    fetchThreads();
  }, [chatClient, userId]);

  return {
    threads,
    setThreads,
    selectedThreadId,
    setSelectedThreadId,
    resolvedThreadId,
    setResolvedThreadId,
    isLoading
  };
};
