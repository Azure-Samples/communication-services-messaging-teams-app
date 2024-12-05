// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as express from 'express';
import { createAgentWorkItem, getAgentWorkItems, updateAgentWorkItem } from '../services/agentWorkItemService';

const router = express.Router();

/**
 * route: /agentWorkItem
 *
 * purpose: Get the all the agent work items.
 *
 * @returns An array of type AgentWorkItem
 *
 */
router.get('/', async function (req, res, next) {
  try {
    const resources = await getAgentWorkItems();
    if (!resources) {
      return res.status(404).json({ message: 'Threads not found' });
    }
    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * route: /agentWorkItem
 *
 * purpose: Create a new agent work item.
 *
 * @returns An object of type AgentWorkItem
 *
 */
router.post('/', async (req, res) => {
  const { id, status } = req.body;
  if (!id || !status || !['active', 'resolved'].includes(status)) {
    return res.status(400).json({ message: 'Invalid agent work item threadId or status' });
  }

  try {
    const createdResource = await createAgentWorkItem({ id, status });
    res.json(createdResource);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * route: /agentWorkItem
 *
 * purpose: Update an agent work item.
 *
 * @param threadId The thread id for the agent work item
 *
 * @returns An object of type AgentWorkItem
 *
 */
router.put('/:threadId', async (req, res) => {
  const threadId = req.params.threadId;
  const { status } = req.body;

  if (!status || !['active', 'resolved'].includes(status)) {
    return res.status(400).json({ message: 'Invalid agent work item status' });
  }

  try {
    const updatedResource = await updateAgentWorkItem(threadId, status);
    if (!updatedResource) {
      return res.status(404).json({ message: 'Thread properties not found' });
    }
    res.json(updatedResource);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
