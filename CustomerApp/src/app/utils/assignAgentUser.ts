// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { StatusCode } from './constants';

export const assignAgentUser = async (threadId: string): Promise<string> => {
  try {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ threadId })
    };
    const response = await fetch('/assignAgentUser', requestOptions);
    if (response.status === StatusCode.OK) {
      return await response.text();
    } else {
      throw new Error('Failed at assign an agent user to the chat thread ' + response.status);
    }
  } catch (error) {
    throw new Error('Failed at assign an agent user to the chat thread');
  }
};
