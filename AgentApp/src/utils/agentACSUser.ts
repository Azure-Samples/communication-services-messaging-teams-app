// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { StatusCode } from './constants';

export interface AgentUser {
  teamsUserId: string;
  acsUserId: string;
  displayName: string;
}

/**
 * Get the Azure Communication Services user info for a given Teams user.
 */
export const getAgentACSUser = async (teamsUserId: string): Promise<AgentUser> => {
  try {
    const options = {
      method: 'GET'
    };
    const response = await fetch(`/agentACSUser/?teamsUserId=${teamsUserId}`, options);

    if (response.status === StatusCode.OK) {
      return await response.json();
    } else {
      throw new Error("Failed at getting agent's ACS user, Error: " + response.status);
    }
  } catch (error) {
    throw new Error('Failed at getting agent ACS user, Error: ' + error);
  }
};
