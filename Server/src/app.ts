// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import express from 'express';
import cors from 'cors';
import createError from 'http-errors';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import path from 'path';

import issueToken from './routes/issueToken';
import refreshToken from './routes/refreshToken';
import getEndpointUrl from './routes/getEndpointUrl';
import userConfig from './routes/userConfig';
import createThread from './routes/createThread';
import addUser from './routes/addUser';
import uploadToAzureBlobStorage from './routes/uploadToAzureBlobStorage';
import agentACSUser from './routes/agentACSUser';
import agentWorkItem from './routes/agentWorkItem';
import assignAgentUser from './routes/assignAgentUser';

const app = express();

app.use(logger('tiny'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.resolve(__dirname, 'build')));

/**
 * route: /
 * purpose: default route when the app is started
 */
app.get('/', (req, res) => {
  res.send('Welcome to the Home Page');
});

/**
 * route: /createThread
 * purpose: Chat: create a new chat thread
 */
app.use('/createThread', cors(), createThread);

/**
 * route: /assignAgentUser
 * purpose: Chat: assign an agent user to the chat thread
 */
app.use('/assignAgentUser', cors(), assignAgentUser);

/**
 * route: /addUser
 * purpose: Chat: add the user to the chat thread
 */
app.use('/addUser', cors(), addUser);

/**
 * route: /refreshToken
 * purpose: Chat,Calling: get a new token
 */
app.use('/refreshToken', cors(), refreshToken);

/**
 * route: /getEndpointUrl
 * purpose: Chat,Calling: get the endpoint url of ACS resource
 */
app.use('/getEndpointUrl', cors(), getEndpointUrl);

/**
 * route: /token
 * purpose: Chat,Calling: get ACS token with the given scope
 */
app.use('/token', cors(), issueToken);

/**
 * route: /userConfig
 * purpose: Chat: to add user details to userconfig for chat thread
 */
app.use('/userConfig', cors(), userConfig);

/**
 * route: /uploadToAzureBlobStorage
 * purpose: Get tokens and endpoints for uploading logs to Azure Blob Storage
 */
app.use('/uploadToAzureBlobStorage', cors(), uploadToAzureBlobStorage);

/**
 * route: /agentACSUser
 * purpose: Get the Azure Communication Services user info for a given Teams user
 */
app.use('/agentACSUser', cors(), agentACSUser);

app.use('/agentWorkItem', cors(), agentWorkItem);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404, `Request url: ${req.url} is not found`));
});

export default app;
