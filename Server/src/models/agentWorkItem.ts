// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
export type AgentWorkItemStatus = 'active' | 'resolved';

export interface AgentWorkItem {
  id: string;
  status: AgentWorkItemStatus;
}
