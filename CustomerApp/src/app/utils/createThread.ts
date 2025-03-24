// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { StatusCode } from './constants';

export const createThread = async (topic: string): Promise<string> => {
  try {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ topic })
    };
    const response = await fetch('/createThread', requestOptions);
    if (response.status === StatusCode.OK) {
      return await response.text();
    } else {
      throw new Error('Failed at creating thread ' + response.status);
    }
  } catch (error) {
    throw new Error('Failed at creating thread');
  }
};
