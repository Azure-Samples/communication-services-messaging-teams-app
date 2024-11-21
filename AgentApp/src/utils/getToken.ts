// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

export type UserToken = {
  expiresOn: number;
  identity: string;
  token: string;
};

/**
 * This gets the token for a given user
 */
export const getToken: (userId: string) => Promise<UserToken> = async (
  userId?: string
) => {
  const getTokenRequestOptions = {
    method: "POST",
  };
  const getTokenResponse = await fetch(
    `/token/user/${userId}?scope=chat`,
    getTokenRequestOptions
  );
  const responseJson = await getTokenResponse.json();
  return {
    expiresOn: responseJson.expiresOn,
    identity: responseJson.user.communicationUserId,
    token: responseJson.token,
  };
};
