// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

export type UserToken = {
  expiresOn: number;
  identity: string;
  token: string;
};

/**
 * This is implemented by contoso and passed to createAzureCommunicationChatAdapter
 */
export const getToken = async (): Promise<UserToken> => {
  try {
    const getTokenRequestOptions = {
      method: 'POST'
    };
    const getTokenResponse = await fetch('/token/newUser?scope=chat', getTokenRequestOptions);
    const responseJson = await getTokenResponse.json();
    return {
      expiresOn: responseJson.expiresOn,
      identity: responseJson.user.communicationUserId,
      token: responseJson.token
    };
  } catch (error) {
    throw new Error('could not get token for user due to error: ' + error);
  }
};
