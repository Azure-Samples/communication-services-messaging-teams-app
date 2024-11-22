// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CommunicationUserToken, TokenScope } from '@azure/communication-identity';
import * as express from 'express';
import { createUserAndToken, getToken } from '../lib/identityClient';

const router = express.Router();

/**
 * handleNewUserTokenRequest will create a new user and return a default scoped token if no scopes are provided.
 * @param requestedScope [optional] string from the request, this should be a comma separated list of scopes.
 */
const handleNewUserTokenRequest = async (requestedScope?: string): Promise<CommunicationUserToken> => {
  const scopes: TokenScope[] = requestedScope ? (requestedScope.split(',') as TokenScope[]) : ['chat'];
  return await createUserAndToken(scopes);
};

/**
 * handleUserTokenRequest will return a default scoped token for the given user if no scopes are provided.
 * @param userId string from the request, this should be a string of an ACS user id.
 * @param requestedScope [optional] string from the request, this should be a comma separated list of scopes.
 */
const handleUserTokenRequest = async (userId: string, requestedScope?: string): Promise<CommunicationUserToken> => {
  const scopes: TokenScope[] = requestedScope ? (requestedScope.split(',') as TokenScope[]) : ['chat'];
  const user = { communicationUserId: userId };
  const token = await getToken(user, scopes);
  return { ...token, user: { communicationUserId: user.communicationUserId } };
};

/**
 * route: /token/newUser
 *
 * purpose: To get Azure Communication Services token with the given scope.
 *
 * @param scope: scope for the token as string
 *
 * @returns The token of type CommunicationUserToken
 *
 * @remarks
 * By default the get and post routes will return a token with scopes ['chat'].
 * Optionally ?scope can be passed in containing scopes separated by comma
 * e.g. ?scope=chat
 *
 */
router.post('/newUser', async (req, res, next) =>
  res.send(await handleNewUserTokenRequest((req.query.scope as string) ?? ''))
);

/**
 * route: /token/user/:userId
 *
 * purpose: To get Azure Communication Services token for a given user with the given scope.
 *
 * @param userId: the ACS id of the user
 * @param scope: scope for the token as string
 *
 * @returns The token of type CommunicationUserToken
 *
 * @remarks
 * By default the get and post routes will return a token with scopes ['chat'].
 * Optionally ?scope can be passed in containing scopes separated by comma
 * e.g. ?scope=chat
 *
 */
router.post('/user/:userId', async (req, res, next) => {
  const userId = req.params.userId;
  const scope = req.query.scope;
  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }
  res.send(await handleUserTokenRequest(userId, scope as string | undefined));
});

export default router;
