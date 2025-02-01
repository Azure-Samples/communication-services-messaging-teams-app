// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as express from 'express';
import { createChatThreadClient } from '../lib/chatClient';
import { getAdminUser } from '../lib/identityClient';

const router = express.Router();
interface AddUserParam {
  Id: string;
  DisplayName: string;
}

/**
 * route: /addUser/[threadId]
 *
 * purpose: Add the user to the chat thread with given threadId.
 *
 * @param threadId: id of the thread to which user needs to be added
 * @param id: id of the user as string
 * @param displayName: display name of the user as string
 *
 */

router.post('/:threadId', async function (req, res, next) {
  const addUserParam: AddUserParam = req.body;
  const threadId = req.params['threadId'];
  try {
    await addUserToThread(threadId, addUserParam.Id, addUserParam.DisplayName);
    res.sendStatus(201);
  } catch (err) {
    // we will return a 404 if the thread to join is not accessible by the server user.
    // The server user needs to be in the thread in order to add someone.
    // So we are returning back that we can't find the thread to add the client user to.
    res.sendStatus(404);
  }
});

export const addUserToThread = async (threadId: string, userId: string, displayName: string): Promise<void> => {
  // use the server admin user to add the user to the chat thread
  const user = await getAdminUser();
  const chatThreadClient = await createChatThreadClient(user, threadId);

  await chatThreadClient.addParticipants({
    participants: [
      {
        id: { communicationUserId: userId },
        displayName: displayName
      }
    ]
  });
};

export default router;
