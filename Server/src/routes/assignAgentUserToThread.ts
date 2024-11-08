// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ChatClient } from '@azure/communication-chat';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import * as express from 'express';
import { getAgentUserList, getEndpoint } from '../lib/envHelper';
import { getAdminUser, getToken } from '../lib/identityClient';

const router = express.Router();

/**
 * route: /assignAgentUserToThread/[threadId]
 *
 * purpose: Assign an customer support agent to the chat thread.
 *
 * @param threadId: id of the thread to which the agent user needs to be assigned to
 *
 */

router.post('/:threadId', async function (req, res, next) {
  const threadId = req.params['threadId'];

  // create a user from the adminUserId and create a credential around that
  const credential = new AzureCommunicationTokenCredential({
    tokenRefresher: async () => (await getToken(getAdminUser(), ['chat'])).token,
    refreshProactively: true
  });

  const chatClient = new ChatClient(getEndpoint(), credential);
  const chatThreadClient = await chatClient.getChatThreadClient(threadId);

  // Select an agent user to add to the chat thread
  const agentUserList = getAgentUserList();
  const agentUserIndex = Math.floor(Math.random() * agentUserList.length);  
  const agentUser = agentUserList[agentUserIndex];
  const agentUserId = agentUser.ACSUserId;
  
  try {
    await chatThreadClient.addParticipants({
      participants: [
        {
          id: { communicationUserId: agentUserId },
          displayName: agentUser.DisplayName
        }
      ]
    });    
    res.sendStatus(201);
  } catch (err) {
    // we will return a 404 if the thread to join is not accessible by the server user.
    // The server user needs to be in the thread in order to add someone.
    // So we are returning back that we can't find the thread to add the client user to.
    console.log('Error adding agent to thread:', err);
    
    res.sendStatus(404);
  }
});

export default router;
