// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ThreadItemStatus } from '../../components/chat/useThreads';
import { StatusCode } from '../constants';

export interface AgentWorkItem {
  id: string;
  status: ThreadItemStatus;
}

export const getAgentWorkItems = async (): Promise<AgentWorkItem[]> => {
  try {
    const options = {
      method: 'GET'
    };
    const response = await fetch(`/agentWorkItem`, options);

    if (response.status === StatusCode.OK) {
      return await response.json();
    } else {
      throw new Error('Failed at getting agent work items, Error: ' + response.status);
    }
  } catch (error) {
    throw new Error('Failed at getting agent work items, Error: ' + error);
  }
};

export const createAgentWorkItem = async (threadId: string, status: ThreadItemStatus): Promise<AgentWorkItem> => {
  try {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: threadId, status: status })
    };
    const response = await fetch('/agentWorkItem', options);

    if (response.status === StatusCode.OK) {
      return await response.json();
    } else {
      throw new Error(`Failed at creating agent work item for threadId ${threadId}, Error: ` + response.status);
    }
  } catch (error) {
    throw new Error(`Failed at creating agent work item for threadId ${threadId}, Error: ` + error);
  }
};

export const updateAgentWorkItem = async (threadId: string, status: ThreadItemStatus): Promise<AgentWorkItem> => {
  try {
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: status })
    };
    const response = await fetch(`/agentWorkItem/${threadId}`, options);

    if (response.status === StatusCode.OK) {
      return response.json();
    } else {
      throw new Error(`Failed at updating agent work item for threadId ${threadId}, Error: ` + response.status);
    }
  } catch (error) {
    throw new Error(`Failed at updating agent work item for threadId ${threadId}, Error: ` + error);
  }
};
