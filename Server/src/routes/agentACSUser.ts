// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as express from 'express';
import { getAgentUsers } from '../lib/envHelper';
import { AgentUser } from '../lib/envHelper';

const router = express.Router();

/**
 * route: /agentACSUser
 *
 * purpose: Get the Azure Communication Services user info for a given Teams user.
 *
 * @param teamsUserId The Teams user id to get the ACS user info for
 *
 * @returns An object of type AgentUser that containing the ACS user info for the given Teams user
 *
 */

router.get('/', async function (req, res, next) {
  const teamsUserId = req.query.teamsUserId;

  if (!teamsUserId) {
    res.status(404).send('TeamsUserId is not provided.');
    return;
  }

  const agentUsers: AgentUser[] = await getAgentUsers();

  if (!agentUsers) {
    res.status(404).send('Agent users not found');
    return;
  }

  const agentUser = agentUsers.find((user) => user.teamsUserId === teamsUserId);

  if (!agentUser) {
    res.status(404).send(`No linked ACS user found for TeamsUserId: ${teamsUserId}`);
    return;
  }

  res.send(agentUser);
});

export default router;
