// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as express from 'express';
import { AgentUser, getAgentUsers } from '../../src/lib/envHelper';
import { addUserToThread } from './addUser';

const router = express.Router();

/**
 * route: /assignAgentUser
 *
 * purpose: Assign a random agent user to the chat thread.
 *
 * @returns The display name of the assigned agent user
 *
 */
router.post('/', async function (req, res, next) {
  const { threadId } = req.body;
  const agentUser = getAgentUser();
  try {
    await addUserToThread(threadId, agentUser.acsUserId, agentUser.displayName);
    res.send(agentUser.displayName);
  } catch (error) {
    // we will return a 404 if the thread to join is not accessible by the server user.
    // The server user needs to be in the thread in order to add someone.
    // So we are returning back that we can't find the thread to add the client user to.
    res.sendStatus(404);
  }
});

// Select a random agent user to add to the chat thread
// This is a simple implementation. In a production scenario, you would want to implement a more sophisticated way to select an agent user.
const getAgentUser = (): AgentUser => {
  const AgentUsers = getAgentUsers();
  const agentUserIndex = Math.floor(Math.random() * AgentUsers.length);
  const agentUser = AgentUsers[agentUserIndex];
  return agentUser;
};

export default router;
