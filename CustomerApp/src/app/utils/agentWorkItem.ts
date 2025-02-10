// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { StatusCode } from './constants';

export enum ThreadItemStatus {
  ACTIVE = 'active',
  RESOLVED = 'resolved'
}

export interface AgentWorkItem {
  id: string;
  status: ThreadItemStatus;
}

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
