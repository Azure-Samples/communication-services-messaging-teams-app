// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { StatusCode } from './constants';

export const sendMessage = async (
  senderId: string,
  senderDisplayName: string,
  threadId: string,
  content: string
): Promise<void> => {
  try {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ senderId, senderDisplayName, threadId, content })
    };
    const response = await fetch('/sendMessage', requestOptions);
    if (response.status === StatusCode.OK) {
      return;
    } else {
      throw new Error('Failed to send messages to the chat thread ' + response.status);
    }
  } catch (error) {
    console.error('Failed to send messages to the chat thread ', error);
    throw new Error('Failed to send messages to the chat thread');
  }
};
