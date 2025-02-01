// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import { getEndpoint } from './envHelper';
import { ChatClient, ChatThreadClient } from '@azure/communication-chat';

import { getToken } from './identityClient';

export const createChatClient = async (userIdentifier: CommunicationUserIdentifier): Promise<ChatClient> => {
  const credential = new AzureCommunicationTokenCredential({
    tokenRefresher: async () => (await getToken(userIdentifier, ['chat'])).token,
    refreshProactively: true
  });

  const chatClient = new ChatClient(getEndpoint(), credential);
  return chatClient;
};

export const createChatThreadClient = async (
  userIdentifier: CommunicationUserIdentifier,
  threadId: string
): Promise<ChatThreadClient> => {
  const chatClient = await createChatClient(userIdentifier);
  const chatThreadClient = await chatClient.getChatThreadClient(threadId);
  return chatThreadClient;
};
