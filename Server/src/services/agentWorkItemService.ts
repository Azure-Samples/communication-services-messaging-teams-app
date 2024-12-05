// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { AgentWorkItem, AgentWorkItemStatus } from '../models/agentWorkItem';
import { getAgentWorkItemsContainer } from '../lib/cosmosdbSetup';

export const createAgentWorkItem = async (thread: AgentWorkItem): Promise<AgentWorkItem> => {
  try {
    const agentWorkItemsContainer = await getAgentWorkItemsContainer();
    const { resource } = await agentWorkItemsContainer.items.create(thread);
    return resource;
  } catch (error) {
    throw new Error(`Cosmos DB Error: ${error.message}`);
  }
};

export const getAgentWorkItems = async (): Promise<AgentWorkItem[]> => {
  try {
    const agentWorkItemsContainer = await getAgentWorkItemsContainer();
    const { resources } = await agentWorkItemsContainer.items.readAll().fetchAll();
    return resources as AgentWorkItem[];
  } catch (error) {
    throw new Error(`Cosmos DB Error: ${error.message}`);
  }
};

export const updateAgentWorkItem = async (threadId: string, status: AgentWorkItemStatus): Promise<AgentWorkItem> => {
  try {
    const agentWorkItemsContainer = await getAgentWorkItemsContainer();
    const { resource } = await agentWorkItemsContainer.item(threadId).read();
    if (resource) {
      resource.status = status;
      const { resource: updatedResource } = await agentWorkItemsContainer.item(threadId).replace(resource);
      return updatedResource;
    }
  } catch (error) {
    throw new Error(`Cosmos DB Error: ${error.message}`);
  }
};
