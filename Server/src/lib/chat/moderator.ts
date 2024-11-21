// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { ChatClient, CreateChatThreadOptions, CreateChatThreadRequest } from '@azure/communication-chat';
import { AgentUser, getAgentUsers, getEndpoint } from '../envHelper';
import { getAdminUser, getToken } from '../identityClient';

export const createThread = async (topicName?: string): Promise<string> => {
  const user = await getAdminUser();

  const credential = new AzureCommunicationTokenCredential({
    tokenRefresher: async () => (await getToken(user, ['chat'])).token,
    refreshProactively: true
  });
  const chatClient = new ChatClient(getEndpoint(), credential);

  const request: CreateChatThreadRequest = {
    topic: topicName ?? 'Your Chat sample'
  };

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
        id: { communicationUserId: agentUser.ACSUserId },
        displayName: agentUser.DisplayName
      }
    ]
  };
  const result = await chatClient.createChatThread(request, options);

  const threadID = result.chatThread?.id;
  if (!threadID) {
    throw new Error(`Invalid or missing ID for newly created thread ${result.chatThread}`);
  }

  return threadID;
};

const getAgentUser = (): AgentUser => {
  // Select a random agent user to add to the chat thread
  // This is a simple implementation. In a production scenario, you would want to implement a more sophisticated way to select an agent user.
  const AgentUsers = getAgentUsers();
  const agentUserIndex = Math.floor(Math.random() * AgentUsers.length);  
  const agentUser = AgentUsers[agentUserIndex];
  return agentUser;
}
