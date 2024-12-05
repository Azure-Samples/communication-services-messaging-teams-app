// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { ChatClient, CreateChatThreadOptions, CreateChatThreadRequest } from '@azure/communication-chat';
import { AgentUser, getAgentUsers, getEndpoint } from '../envHelper';
import { getAdminUser, getToken } from '../identityClient';
import { createAgentWorkItem } from '../../services/agentWorkItemService';
import { AgentWorkItemStatus } from '../../models/agentWorkItem';

// TODO: Remove this when topicName can be passed in
let count = 0;

export const createThread = async (topicName?: string): Promise<string> => {
  const user = await getAdminUser();

  const credential = new AzureCommunicationTokenCredential({
    tokenRefresher: async () => (await getToken(user, ['chat'])).token,
    refreshProactively: true
  });
  const chatClient = new ChatClient(getEndpoint(), credential);

  const request: CreateChatThreadRequest = {
    topic: topicName ?? `Your Chat sample thread ${count}`
  };

  // TODO: Remove this when topicName can be passed in
  count++;

  // Select an agent user to add to the chat thread
  const agentUser = getAgentUser();

  const options: CreateChatThreadOptions = {
    participants: [
      {
        id: {
          communicationUserId: user.communicationUserId
        }
      },
      {
        id: { communicationUserId: agentUser.acsUserId },
        displayName: agentUser.displayName
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

const getAgentUser = (): AgentUser => {
  // Select a random agent user to add to the chat thread
  // This is a simple implementation. In a production scenario, you would want to implement a more sophisticated way to select an agent user.
  const AgentUsers = getAgentUsers();
  const agentUserIndex = Math.floor(Math.random() * AgentUsers.length);
  const agentUser = AgentUsers[agentUserIndex];
  return agentUser;
};

const saveAgentWorkItemToDatabase = async (threadId: string, status: AgentWorkItemStatus): Promise<void> => {
  try {
    await createAgentWorkItem({ id: threadId, status: status });
  } catch (error) {
    console.error(error);
  }
};
