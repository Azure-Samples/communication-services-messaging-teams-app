// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as express from 'express';
import { createChatThreadClient } from '../lib/chatClient';

const router = express.Router();

/**
 * route: /sendMessage
 *
 * purpose: Send an ACS message to the chat thread.
 *
 */
router.post('/', async function (req, res, next) {
  const { senderId, senderDisplayName, threadId, content } = req.body;
  const sender = { communicationUserId: senderId };
  const chatThreadClient = await createChatThreadClient(sender, threadId);
  try {
    await chatThreadClient.sendMessage({ content }, { senderDisplayName: senderDisplayName });
    res.sendStatus(200);
  } catch (error) {
    res.send(error);
  }
});

export default router;
