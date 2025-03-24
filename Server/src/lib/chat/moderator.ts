// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CreateChatThreadOptions, CreateChatThreadRequest } from '@azure/communication-chat';
import { getAdminUser } from '../identityClient';
import { createAgentWorkItem } from '../../services/agentWorkItemService';
import { AgentWorkItemStatus } from '../../models/agentWorkItem';
import { createChatClient } from '../chatClient';

export const createThread = async (topic?: string): Promise<string> => {
  // create a user from the adminUserId and create a credential around that
  const user = await getAdminUser();
  const chatClient = await createChatClient(user);

  const request: CreateChatThreadRequest = {
    topic: topic ?? `Your Chat sample thread`
  };

  const options: CreateChatThreadOptions = {
    participants: [
      {
        id: {
          communicationUserId: user.communicationUserId
        }
      }
    ]
  };
  const result = await chatClient.createChatThread(request, options);

  const threadId = result.chatThread?.id;
  if (!threadId) {
    throw new Error(`Invalid or missing ID for newly created thread ${result.chatThread}`);
  }

  saveAgentWorkItemToDatabase(threadId, 'active');

  return threadId;
};

const saveAgentWorkItemToDatabase = async (threadId: string, status: AgentWorkItemStatus): Promise<void> => {
  try {
    await createAgentWorkItem({ id: threadId, status: status });
  } catch (error) {
    console.error(error);
  }
};
