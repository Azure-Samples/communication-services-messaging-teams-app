// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { assignAgentUser } from './assignAgentUser';
import { strings } from './constants';
import { createThread } from './createThread';
import { getEndpointUrl } from './getEndpointUrl';
import { getToken } from './getToken';
import { joinThread } from './joinThread';
import { sendMessage } from './sendMessage';

export interface CreateAndJoinChatThreadWithNewUserProps {
  displayName: string;
  questionSummary: string;
  onJoinChat(): void;
  setToken(token: string): void;
  setUserId(userId: string): void;
  setThreadId(threadId: string): void;
  setEndpointUrl(endpointUrl: string): void;
  setAgentName(agentName: string): void;
  onError(error: string, questionSummary: string): void;
}

// This function creates a new chat thread and a new ACS user,
// then joins the thread with the newly created user.
export const createAndJoinChatThreadWithNewUser = (props: CreateAndJoinChatThreadWithNewUserProps): void => {
  const {
    displayName,
    questionSummary,
    onJoinChat,
    setToken,
    setUserId,
    setThreadId,
    setEndpointUrl,
    setAgentName,
    onError
  } = props;
  const createAndJoinChatThread = async (): Promise<void> => {
    try {
      // Create a new chat thread
      const threadId = await createThread();
      if (!threadId) {
        console.error('Failed to create a thread, returned threadId is undefined or empty string');
        onError(strings.unableToStartChat, questionSummary);
        return;
      }
      setThreadId(threadId);

      // Create a new ACS user
      const token = await getToken();
      const endpointUrl = await getEndpointUrl();

      setToken(token.token);
      setUserId(token.identity);
      setEndpointUrl(endpointUrl);

      // Join the thread with the newly created user
      const result = await joinThread(threadId, token.identity, displayName);
      if (!result) {
        console.error('Failed to join the thread ', threadId);
        onError(strings.unableToStartChat, questionSummary);
        return;
      }

      // Assign a random agent
      const agentDisplayName = await assignAgentUser(threadId);
      if (agentDisplayName === undefined) {
        console.error('Failed to assign an agent to the chat thread');
        onError(strings.unableToStartChat, questionSummary);
        return;
      }
      setAgentName(agentDisplayName);

      // Send the initial message with the question summary
      sendMessage(token.identity, displayName, threadId, questionSummary);

      onJoinChat();
    } catch (error) {
      console.error('An unexpected error occurred:', error);
      onError(strings.unableToStartChat, questionSummary);
    }
  };
  createAndJoinChatThread();
};
